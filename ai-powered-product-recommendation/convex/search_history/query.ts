import { query } from "../_generated/server";
import { v } from "convex/values";

// This query expects a userId (string) and returns the matching user from your "users" table
export const getUserByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Query your "users" table for a document with the matching userId
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    return user;
  },
});