import { internalMutation, mutation } from "../_generated/server";
import { ComparisonFields } from "./schema";
import { v } from "convex/values";

export const createComparison = internalMutation({
  args: ComparisonFields,
  handler: async (ctx, args) => {
    await ctx.db.insert("comparisons", args)
     }

});


