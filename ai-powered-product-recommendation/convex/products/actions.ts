import { v } from "convex/values";
import { action } from "../_generated/server";
import { getEmbeddings } from "@/app/api/ai/embeddings/embeddings";
import { internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";


export const similarProducts = action({
  args: {
    query: v.string()
  },
  handler: async (ctx, args) => {
    const embeddingArray = await getEmbeddings([args.query]);
    const embedding = embeddingArray[0]; 

    if (!embedding) {
      throw new Error("Failed to generate embedding");
    }

    const results = await ctx.vectorSearch("products", "by_embedding", {
      vector: embedding,
      limit: 5,
      // filter: (q) => q.eq("category", ["Headphone"]),
    });

    const products: Array<Doc<"products">> = await ctx.runQuery(
      internal.products.query.fetchResults,
      { ids: results.map((result) => result._id) },
    );
    return products;
  }
}); 

