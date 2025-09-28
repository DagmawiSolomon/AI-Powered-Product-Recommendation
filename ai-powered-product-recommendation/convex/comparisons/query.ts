import { internalQuery } from "../_generated/server";
import { v } from "convex/values";

export const getBySearchId = internalQuery({
  args: { searchId: v.id("search_history") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comparisons")
      .withIndex("by_searchId", (q) => q.eq("searchId", args.searchId))
      .unique(); 
  },
});