import { GoogleGenAI, createUserContent, createPartFromUri, FileState } from "@google/genai";
import type { Criterion } from "@/types/evaluation";
import { EvaluationResultSchema } from "@/lib/evaluation-schema";

// Evaluation model: Gemma 4
const MODEL_ID = "gemma-4-26b-a4b-it";

const SYSTEM_INSTRUCTION = `You are an evidence-review assistant for a software project evaluation system.

Your role is to evaluate each reviewer-defined criterion ONLY against the supplied multimodal evidence (videos, screenshots, and participant claims).

CRITICAL RULES:
1. Do not assume functionality that is not demonstrated in the evidence.
2. ABSENCE OF EVIDENCE IS NOT EVIDENCE OF FAILURE. If something is simply not shown, return NOT_DEMONSTRATED — not FAIL.
3. Use FAIL only when the supplied evidence actually demonstrates behavior that contradicts the criterion.
4. Use UNCERTAIN when relevant evidence exists but does not conclusively establish the requirement.
5. Never fabricate timestamps, UI states, actions, or observations.
6. Suggested marks must remain within the criterion's maximum marks (0 to maxMarks).
7. For PASS: suggest high/full marks where evidence justifies it.
8. For PARTIAL: suggest partial marks proportional to what is demonstrated.
9. For FAIL: suggest low/zero marks when evidence clearly contradicts criterion.
10. For NOT_DEMONSTRATED: suggest 0 marks (requirement was not shown).
11. For UNCERTAIN: use null for suggestedMarks when a defensible score cannot be determined.
12. For every conclusion, reference the specific evidence that supports it (filename, timestamp if video).
13. Your evaluation is advisory only. A human reviewer makes the final decision.

Return ONLY valid JSON matching the exact schema provided. No markdown fences, no explanation outside the JSON.`;

function buildPrompt(criteria: Criterion[], claim: string): string {
  const rubric = criteria
    .map(
      (c, i) =>
        `Criterion ${i + 1} (id: "${c.id}"): "${c.requirement}" — max ${c.maxMarks} marks`
    )
    .join("\n");

  const schema = `{
  "summary": {
    "suggestedScore": <number: sum of suggestedMarks, treating null as 0>,
    "maxScore": <number: sum of all maxMarks>,
    "evidenceCoverage": <number 0-100: % of criteria with sufficient evidence>
  },
  "criteria": [
    {
      "criterionId": "<matches criterion id>",
      "criterion": "<criterion text>",
      "status": "<PASS|PARTIAL|FAIL|UNCERTAIN|NOT_DEMONSTRATED>",
      "suggestedMarks": <number or null>,
      "maxMarks": <number>,
      "confidence": <number 0-100>,
      "evidence": [
        {
          "source": "<filename>",
          "timestamp": "<optional: e.g. 00:12 → 00:28>",
          "observation": "<what you actually observe>"
        }
      ],
      "reasoning": "<step-by-step reasoning grounded in evidence>",
      "missingEvidence": "<optional: what evidence would help>"
    }
  ]
}`;

  return `EVALUATION RUBRIC:
${rubric}

PARTICIPANT CLAIM:
${claim || "(No participant claim provided)"}

TASK:
Evaluate every criterion in the rubric against the supplied evidence files attached above.
Return ONLY this JSON structure, no markdown:

${schema}`;
}

export interface UploadedFile {
  name: string;
  mimeType: string;
  base64Data: string;
}

export async function runGemmaEvaluation(
  criteria: Criterion[],
  claim: string,
  files: UploadedFile[]
): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const ai = new GoogleGenAI({ apiKey });

  // Images: inline data. Videos: upload via File API (graceful fallback on failure).
  const inlineParts: Array<{ inlineData: { mimeType: string; data: string } }> = [];
  const uploadedUris: Array<{ uri: string; mimeType: string; name: string }> = [];

  for (const f of files) {
    if (f.mimeType.startsWith("video/")) {
      const buffer = Buffer.from(f.base64Data, "base64");
      const blob = new Blob([buffer], { type: f.mimeType });
      let uploadedFile = await ai.files.upload({
        file: blob,
        config: { mimeType: f.mimeType, displayName: f.name },
      });

      console.log(`[Files API] ${f.name} uploaded, initial state: ${uploadedFile.state}`);

      const timeoutMs = 30000;
      const intervalMs = 1000;
      const startTime = Date.now();

      while (uploadedFile.state !== FileState.ACTIVE) {
        if (uploadedFile.state === FileState.FAILED) {
          throw new Error(
            `Google Files API failed to process evidence file "${f.name}": ${uploadedFile.error?.message ?? "Processing failed"}`
          );
        }

        if (Date.now() - startTime > timeoutMs) {
          throw new Error(
            `Timeout (30s) waiting for evidence file "${f.name}" to become ACTIVE (last state: ${uploadedFile.state})`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, intervalMs));

        if (!uploadedFile.name) {
          throw new Error(
            `Uploaded file "${f.name}" did not return a valid resource name for polling.`
          );
        }

        uploadedFile = await ai.files.get({
          name: uploadedFile.name,
        });
        console.log(`[Files API] Polling ${f.name}: state is ${uploadedFile.state}`);
      }

      console.log(`[Files API] ${f.name} final state: ${uploadedFile.state}`);

      if (uploadedFile.uri && uploadedFile.mimeType) {
        uploadedUris.push({
          uri: uploadedFile.uri,
          mimeType: uploadedFile.mimeType,
          name: f.name,
        });
      }
    } else {
      inlineParts.push({
        inlineData: { mimeType: f.mimeType, data: f.base64Data },
      });
    }
  }

  const prompt = buildPrompt(criteria, claim);

  // Assemble content parts
  const contentParts: Array<unknown> = [];
  for (const u of uploadedUris) {
    contentParts.push(createPartFromUri(u.uri, u.mimeType));
    contentParts.push({ text: `[Video file: ${u.name}]` });
  }
  for (const p of inlineParts) {
    contentParts.push(p);
  }
  contentParts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: MODEL_ID,
    contents: createUserContent(contentParts as Parameters<typeof createUserContent>[0]),
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.1,
      maxOutputTokens: 8192,
    },
  });

  const text = response.text ?? "";
  // Strip any markdown code fences
  const cleaned = text
    .replace(/^```(?:json)?\s*/im, "")
    .replace(/\s*```\s*$/im, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Model returned non-JSON output. Preview: ${cleaned.slice(0, 300)}`);
  }
  return parsed;
}

export { EvaluationResultSchema };
