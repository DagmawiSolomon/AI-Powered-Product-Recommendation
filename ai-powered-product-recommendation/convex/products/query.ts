import { internalQuery } from "../_generated/server";
import { v } from "convex/values";

export const fetchResults = internalQuery({
  args: { ids: v.array(v.id("products")) },
  handler: async (ctx, args) => {
    const results = [];
    for (const id of args.ids) {
      const doc = await ctx.db.get(id);
      if (doc === null) {
        continue;
      }
      results.push(doc);
    }
    return results;
  },
});
