import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { GoogleGenAI } from "@google/genai";

async function getEmbeddings(contents: string | string[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents,
    config: {
      taskType: "SEMANTIC_SIMILARITY",
      outputDimensionality: 768,
    },
  });

  return response.embeddings; // array of { values }
}

export async function POST(request: Request) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.text) {
    return NextResponse.json({ error: "Missing Text Field" }, { status: 400 });
  }

  const embeddings = await getEmbeddings(body.text);

  return NextResponse.json({
    success: true,
    embeddings, // consistent with Gemini docs
  });
}
