import { Doc } from "../_generated/dataModel"
import { GoogleGenAI } from "@google/genai";
import { Id } from "../_generated/dataModel";



export type Product_Metadata = {
  _id: Id<"products">;  
  name: string;
  description: string;
  category: string;
  tags: string[];
};


type LLM_INPUT = {
  query: string,
  results: Product_Metadata[]
}

type ranked_output = {
  id: Id<'products'>,
  score: number,
  rank: number,
  reason: string,
}

export type LLM_RESPONSE = {
  ranking: ranked_output[]
}

/**
 * Cleans raw LLM output to ensure it's valid JSON.
 * Removes Markdown fences, stray undefined, and trailing commas.
 */
export function cleanAIJson(raw: string): string {
  if (!raw) return "";

  let text = raw;

  // Remove any Markdown code fences ```json ... ```
  text = text.replace(/```(?:json)?/gi, "");

  // Remove any stray "undefined" or other trailing words after JSON
  text = text.replace(/\bundefined\b/gi, "");

  // Remove trailing commas before } or ]
  text = text.replace(/,\s*(\}|\])/g, "$1");

  // Trim leading/trailing whitespace
  text = text.trim();

  return text;
}


const instruction_prompt = `
You are an AI ranking engine. Your task is to **rerank a list of product candidates** based on relevance to the user query.

### Inputs:
- User query: <string>
- Candidate products: array of objects with metadata (id,name, description, category, tags).

### Output Format:
- Strictly **valid JSON only**, structured as:

### Tone:
- Phrase the "reason" field as if your **explaining to the user in first person**
- Be concise, clear, and tied to metadata; do not invent attributes.

{
  "ranking": [
    {
      "id": "prod_123",
      "score": 0.92,
      "rank": 1,
      "reason": "Matches user query budget and category."
    },
    ...
  ]
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
6. For reasoning or expansions:
   - Always phrase in **third person** (never "I", "you", or "we").
   - Use a concise **pros/cons style** or short trade-off statement.
   - Keep it as brief as possible without losing value.
   - Example good: "Strong CPU and 16GB RAM, but limited SSD and no dedicated GPU."
   - Example bad: "I have a decent AMD Ryzen 7 5700U processor and 16GB RAM, but my 512GB SSD and lack of a dedicated GPU are less optimal..."

### Additional Notes:
- **Only** output JSON — no extra explanations or text.
- The "reason" field must be concise and tied to metadata.
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
    const cleanedText = cleanAIJson(await response.text);
    const safeText = cleanedText
    .replace(/\\'/g, "'")        // fix single quotes
    .replace(/[\u0000-\u001F]+/g, ""); 
    parsed = JSON.parse(safeText);

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
