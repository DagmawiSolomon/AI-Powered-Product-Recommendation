import { GoogleGenAI } from "@google/genai";
import { Id } from "../_generated/dataModel";


export function formatTimeAgo(timestampMs: number): string {
  const diff = Date.now() - timestampMs
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  return `${days} days ago`
}

type LLM_INPUT = {
  query: string,
  context: {
    product_id: string,
    name: string,
    description: string,
    tags: string[],
    price: number,
    aiRank: string,
    reasoning: string
  }[]
}

const instruction_prompt = `You are an AI assistant that answers user questions about a set of products displayed on a UI. 

### Inputs:
- User query: <string>
- Products array: each object contains:
  {
    "id": <product ID>,
    "name": <product name>,
    "description": <product description>,
    "category": <product category>,
    "brand": <brand>,
    "color": <color>,
    "price": <number>,
    "tags": <string[]>,
    "product_url": <string>
  }

### Task:
- Provide a **relevant, concise answer** to the user's query using **only the data provided**.
- Do **not invent any information** or speculate about products that are not in the array.
- Use product metadata (name, description, category, brand, color, price, tags) to construct the response.
- If the query cannot be answered based on the provided products, respond clearly that no matching product information is available.
- Reference products by **name** where appropriate.

### Output Format:
- Return a **single string** in plain text or markdown.
- Do not include any additional explanations about your reasoning; only provide the answer.
- Keep the response **concise, user-friendly, and actionable**.

### Example:
**User Query:** "Which of these laptops has the best GPU under $1500?"  
**Products:** [{name: "Laptop A", description: "...", price: 1400, tags: ["RTX 4070"]}, {name: "Laptop B", description: "...", price: 1600, tags: ["RTX 4080"]}]  

**Output:**  
"Laptop A has the best GPU within your budget, featuring an RTX 4070."

### Additional Notes:
- Focus on **relevance to the user query**.  
- Avoid repeating the entire product list unless necessary.  
- If multiple products match equally well, summarize the **top options** in one concise sentence.
`

export async function AIAssistant(input: LLM_INPUT){
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_GEMINI_API_KEY environment variable not set!");

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: `
      ${instruction_prompt}
      ### Inputs:
      - User query: ${input.query}
      - Candidate products: ${JSON.stringify(input.context)}
    `,
    config: { temperature: 0.15 }
  });

  if (!response.text) throw new Error("No response text from AI");

  const llm_response = await response.text;
   
  return llm_response; 
}