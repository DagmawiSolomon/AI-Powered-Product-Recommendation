import { mutation } from "../_generated/server";
import { productFields } from "./productFields";
import { v } from "convex/values";


export const CreateProducts= mutation({
  args: { products: v.array(v.object(productFields)) },
  handler: async (ctx, { products }) => {
    const results: { id?: string; success: boolean; error?: string }[] = [];

    for (const p of products) {
      try {
        const id = await ctx.db.insert("products", {
          name: p.name,
          category: p.category,
          price: p.price,
          image: p.image,
          url: p.url,
          description: p.description,
          embedding: p.embedding,
        });

        results.push({ id, success: true });
      } catch (err: any) {
        results.push({ success: false, error: err.message || "Unknown error" });
      }
    }

    return results;
  },
});
