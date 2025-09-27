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
  args: { searchId: v.string() },
  handler: async (ctx, args) => {
    // Fetch the search_history document
    const searchHistory = await ctx.db.get(args.searchId as Id<"search_history">);
    if (!searchHistory) {
      throw new Error("search_history not found");
    }

    // Update the status
    await ctx.db.patch(args.searchId as Id<"search_history">, { status: "processing" });

    // Schedule the action with user_query from the document
    const result = await ctx.scheduler.runAfter(0, internal.products.actions.HybridSearchWorkFlow, {
      search_id: args.searchId as Id<"search_history">,
      user_query: searchHistory.prompt,
    });

    console.log(result);
  },
});