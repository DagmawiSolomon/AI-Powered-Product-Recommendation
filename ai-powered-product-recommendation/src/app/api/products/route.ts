import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth-server";
import { api } from "../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";



type Product = {
    name: string;
    category: string[];
    price: number;
    image: string;
    url: string;
    description: string;
}

export async function POST(request: Request){
    const token = await getToken();  
    console.log(token)
    if(!token){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body:Product = await request.json();

    if(!body){
        return NextResponse.json({ error: "Missing Body" }, { status: 400 });
    }

    const embeddings = await fetch("/api/ai/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: body.description,
        }),
    });

    const embeddingData = await embeddings.json();
    const embeddingVector: number[] = embeddingData.embedding;

    const response = fetchMutation(api.products.mutations.CreateProducts, {products: [
      { ...body, embedding: embeddingVector } 
    ]})

  

}
