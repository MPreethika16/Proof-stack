import { NextRequest, NextResponse } from "next/server";
import { runGemmaEvaluation } from "@/lib/gemma";
import { EvaluationResultSchema } from "@/lib/evaluation-schema";

export const maxDuration = 120; // seconds

export async function POST(req: NextRequest) {
  try {
    // ── 1. API key check ──────────────────────────────────────────────
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    // ── 2. Parse multipart form data ──────────────────────────────────
    const formData = await req.formData();

    const criteriaRaw = formData.get("criteria");
    const claim = (formData.get("claim") as string) ?? "";

    if (!criteriaRaw) {
      return NextResponse.json(
        { error: "No rubric criteria provided." },
        { status: 400 }
      );
    }

    const criteria = JSON.parse(criteriaRaw as string) as Array<{
      id: string;
      requirement: string;
      maxMarks: number;
    }>;

    if (!Array.isArray(criteria) || criteria.length === 0) {
      return NextResponse.json(
        { error: "Rubric must contain at least one criterion." },
        { status: 400 }
      );
    }

    // ── 3. Collect uploaded files ─────────────────────────────────────
    const uploadedFiles: Array<{
      name: string;
      mimeType: string;
      base64Data: string;
    }> = [];

    const fileEntries = formData.getAll("files") as File[];
    for (const file of fileEntries) {
      const buffer = Buffer.from(await file.arrayBuffer());
      uploadedFiles.push({
        name: file.name,
        mimeType: file.type,
        base64Data: buffer.toString("base64"),
      });
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: "No evidence files provided." },
        { status: 400 }
      );
    }

    // ── 4. Call Gemma ─────────────────────────────────────────────────
    let rawResult = await runGemmaEvaluation(criteria, claim, uploadedFiles);

    // ── 5. Validate with Zod ──────────────────────────────────────────
    let parsed = EvaluationResultSchema.safeParse(rawResult);

    if (!parsed.success) {
      // One repair attempt: re-run with explicit repair note
      console.warn("Zod validation failed on first attempt, retrying...", parsed.error.issues);
      rawResult = await runGemmaEvaluation(criteria, claim, uploadedFiles);
      parsed = EvaluationResultSchema.safeParse(rawResult);

      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "Gemma returned a malformed response that could not be repaired.",
            details: parsed.error.issues.slice(0, 5),
          },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(parsed.data);
  } catch (err: unknown) {
    console.error("Evaluation error:", err);
    const message =
      err instanceof Error ? err.message : "An unknown server error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
