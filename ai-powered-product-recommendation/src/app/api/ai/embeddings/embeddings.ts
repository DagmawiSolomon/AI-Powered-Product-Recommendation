import { GoogleGenAI } from "@google/genai";

export async function getEmbeddings(contents: string[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents,
    config: {
      taskType: "SEMANTIC_SIMILARITY",
      outputDimensionality: 768,
    },
  });

  if (!response.embeddings) throw new Error("No embeddings returned from Gemini");

  // Map to actual float arrays
  return response.embeddings.map((e) => e.values);
}