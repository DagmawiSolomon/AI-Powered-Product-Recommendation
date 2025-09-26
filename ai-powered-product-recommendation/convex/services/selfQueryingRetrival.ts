"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";

const instructionPrompt = `You are a data engineer and AI search parser.
Task:

Given a natural language user query, output a JSON object containing:
semantic_query – a text string suitable for embedding-based semantic search.
keyword_query – a string containing keywords for exact match or traditional search.
filters – an array of structured filter objects. Only include filters for the fields: price, brand, or color.
Product Table Schema (Allowed Fields)
FieldType_idIdtitlestringdescriptionstringcategorystringbrandstringcolorstringpricenumbertagsstring[]image_urlstringembeddingnumber[]product_urlstring
Rules:

Only create filters for price, brand, or color.
Each filter object must contain:
"field" – one of the three allowed fields
"operator" – one of "=", "<", ">", "<=", ">=",
"value" – of the correct type
If the query does not include any valid filterable field, set "filters": [].
The output must be valid JSON only, without explanations or extra text.
Output Example
User Query: "Find red shoes under $100 from Nike"

{
  "semantic_query": "red shoes",
  "keyword_query": "red shoes",
  "filters": [
    {
      "field": "color",
      "operator": "=",
      "value": "red"
    },
    {
      "field": "price",
      "operator": "<",
      "value": 100
    },
    {
      "field": "brand",
      "operator": "=",
      "value": "Nike"
    }
  ]
}`;

export type Filter = {
  field: "price" | "brand" | "color";
  operator: "=" | "<" | ">" | "<=" | ">=";
  value: string | number;
};

type ParsedQuery = {
  semantic_query: string;
  keyword_query: string;
  filters: Filter[];
};

// Helper function to clean AI response
function cleanAIJson(raw: string): string {
  // Remove ```json and ``` fences
  let cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

  // Take content between first { and last }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in AI response");
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

export const semanticQueryParser = action({
  args: { query: v.string() },
  handler: async (ctx, { query }) => {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_GEMINI_API_KEY environment variable not set!");

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: instructionPrompt + "\nUser Query: " + query,
    });

    if (!response.text) throw new Error("No response text from AI");

    let parsed: ParsedQuery;

    try {
      const cleanedText = cleanAIJson(response.text);
      parsed = JSON.parse(cleanedText);

      // Runtime validation
      if (
        typeof parsed.semantic_query !== "string" ||
        typeof parsed.keyword_query !== "string" ||
        !Array.isArray(parsed.filters)
      ) {
        throw new Error("AI JSON does not match expected structure");
      }

      // Validate each filter
      parsed.filters.forEach((f) => {
        if (
          !["price", "brand", "color"].includes(f.field) ||
          !["=", "<", ">", "<=", ">="].includes(f.operator) ||
          (typeof f.value !== "string" && typeof f.value !== "number")
        ) {
          throw new Error(`Invalid filter object: ${JSON.stringify(f)}`);
        }
      });
    } catch (err) {
      throw new Error("Failed to parse/validate AI response: " + err);
    }

    return parsed;
  },
});
