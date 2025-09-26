import { v } from "convex/values";
import { action } from "../_generated/server";
import { getEmbeddings } from "../services/embeddings";
import { internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";
import { filterValidator } from "./query";

export const similarProducts = action({
  args: {
    semantic_query: v.string(),
    filters: v.optional(v.array(filterValidator)),
  },
  handler: async (ctx, args) => {
    // Step 1: Generate embedding
    const embeddingArray = await getEmbeddings([args.semantic_query]);
    const embedding = embeddingArray[0];
    if (!embedding) throw new Error("Failed to generate embedding");

    // Step 2: Run vector search
    const results = await ctx.vectorSearch("products", "by_embedding", {
      vector: embedding,
      limit: 50, 
    });

    // Step 3: Fetch full product docs
    let products: Array<Doc<"products">> = await ctx.runQuery(
    internal.products.query.fetchResults,
    { ids: results.filter(r => r._score >=  0.8).map(r => r._id) }
  );

  
    // Step 4: Apply filters manually
    if (args.filters) {
      for (const filter of args.filters) {
        products = products.filter((p) => {
          const fieldValue = (p as any)[filter.field];

          switch (filter.operator) {
            case "=":
              return fieldValue === filter.value;
            case "<":
              return fieldValue < filter.value;
            case ">":
              return fieldValue > filter.value;
            case "<=":
              return fieldValue <= filter.value;
            case ">=":
              return fieldValue >= filter.value;
            default:
              throw new Error(`Unsupported operator: ${filter.operator}`);
          }
        });

      }
    }

    // Step 5: Return final products
    return products; // limit after filtering
  },
});
