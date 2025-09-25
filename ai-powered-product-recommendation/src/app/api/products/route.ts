import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { GoogleGenAI } from "@google/genai";
import { api } from "../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

type Product = {
  name: string;
  category: string[];
  price: number;
  image: string;
  url: string;
  description: string;
};

async function getEmbeddings(contents: string[]) {
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

export async function POST(request: Request) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Product[] = await request.json();
  if (!body || body.length === 0) {
    return NextResponse.json({ error: "Missing Body" }, { status: 400 });
  }

  const descriptions = body.map((p) => p.description);
  const embeddings = await getEmbeddings(descriptions);

  
  const productsWithEmbeddings = body.map((p, i) => ({
    ...p,
    embedding: embeddings[i],
  }));

  try {
    const response = await fetchMutation(api.products.mutations.CreateProducts, {
      products: productsWithEmbeddings,
    });

    return NextResponse.json({ success: true, response });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
