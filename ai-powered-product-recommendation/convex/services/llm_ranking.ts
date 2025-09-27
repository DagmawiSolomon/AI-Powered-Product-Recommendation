import { Doc } from "../_generated/dataModel"
import { GoogleGenAI } from "@google/genai";
import { Id } from "../_generated/dataModel";
import { cleanAIJson } from "./selfQueryingRetrival";

type LLM_INPUT = {
  query: string,
  results: Array<Doc<"products">>
}

type ranked_output = {
  id: Id<'products'>,
  score: number,
  rank: number,
  reason: string,
}

export type LLM_RESPONSE = {
  ranking: ranked_output[],
  comparison: string
}

const instruction_prompt = `
You are an AI ranking engine. Your task is to **rerank a list of product candidates** based on relevance to the user query.

### Inputs:
- User query: <string>
- Candidate products: array of objects with metadata (title, description, brand, category, price, color, tags, embedding, product_url).

### Output Format:
- Strictly **valid JSON only**, structured as:

{
  "ranking": [
    {
      "id": "prod_123",
      "score": 0.92,
      "rank": 1,
      "reason": "Matches user query budget and category."
    },
    ...
  ],
  "comparison": "Product prod_123 is the most relevant overall; prod_456 is strong but slightly over budget; prod_789 fits less well due to missing features."
}

### Rules / Safety Measures:
1. **Do not hallucinate** product attributes; only use provided metadata.
2. **Enforce numeric/categorical constraints**:
   - Price, brand, and color must respect query requirements.
3. **Handle missing data safely**:
   - Assign a low score (≤0.3) and note "insufficient data" in reason if key fields are missing.
4. **Score uniqueness**:
   - Ensure unique scores for ranking; adjust slightly if needed to avoid ties.
5. **Semantic reasoning**:
   - Boost products matching the **intent and key features** implied by the query.
6. **Comparison**:
   - In the "comparison" string, summarize the **top 3 ranked products** in 2–3 sentences, highlighting relative strengths, weaknesses, or trade-offs.

### Additional Notes:
- **Only** output JSON — no extra explanations or text.
- The "reason" field must be concise and tied to metadata.
- The "comparison" field is free text but limited to top 3 products try to do in a little words as possible with loosing value.
`

export async function llm_ranking(input: LLM_INPUT) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_GEMINI_API_KEY environment variable not set!");

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      ${instruction_prompt}
      ### Inputs:
      - User query: ${input.query}
      - Candidate products: ${JSON.stringify(input.results)}
    `,
    config: { temperature: 0.15 }
  });

  if (!response.text) throw new Error("No response text from AI");

  let parsed: LLM_RESPONSE;

  try {
    const cleanedText = cleanAIJson(response.text);
    parsed = JSON.parse(cleanedText);

    if (!Array.isArray(parsed.ranking)) {
      throw new Error("Ranking is not an array");
    }

    for (const item of parsed.ranking) {
      if (
        typeof item.id !== "string" ||
        typeof item.score !== "number" ||
        typeof item.rank !== "number" ||
        typeof item.reason !== "string"
      ) {
        throw new Error(`Invalid ranked_output item: ${JSON.stringify(item)}`);
      }
      if (item.score < 0 || item.score > 1) {
        throw new Error(`Score out of bounds for item ${item.id}`);
      }
    }
  } catch (err: any) {
    console.error("LLM output validation failed:", err.message);
    throw new Error(`LLM output invalid: ${err.message}`);
  }


  return parsed; 
}
