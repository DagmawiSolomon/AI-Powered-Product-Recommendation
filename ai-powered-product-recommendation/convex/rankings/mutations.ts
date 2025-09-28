import { mutation } from "../_generated/server";
import { rankingsFields } from "./schema";

export const createRankings = mutation({
  args: rankingsFields,
  handler: async (ctx, args) => {
    await ctx.db.insert("rankings", args);
  }
});