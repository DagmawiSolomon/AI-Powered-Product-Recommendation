import { mutation } from "../_generated/server";
import { productFields } from "./productFields";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";



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
          tags:p.tags,
          search_text: p.search_text,
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


export const startHybirdSearchWorkflow = mutation({
  args: { searchId: v.string()},
  handler: async (ctx, args) => {
    const id = args.searchId as Id<"search_history">;
    const searchHistory = await ctx.db.get(id);
    if (!searchHistory) {
      throw new Error("search_history not found");
    }

    await ctx.db.patch(id, { status: "processing" });

    
    await ctx.scheduler.runAfter(0, internal.products.workflow.kickoffHybridSearch, {
      search_id: id,
      user_query: searchHistory.prompt,
    });

  },
});