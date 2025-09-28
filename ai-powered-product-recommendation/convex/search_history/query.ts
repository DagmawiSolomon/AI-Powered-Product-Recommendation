import { internalQuery, query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
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

export const checkStatus = query({
  args: { id: v.string()},
  handler: async (ctx, args) => {
    const history_id = args.id as Id<"search_history">
    const doc = await ctx.db.get(history_id);
    return doc?.status;
  },
})

export const getResult = query({
  args: { id: v.string()},
  handler: async (ctx, args) => {
    const history_id = args.id as Id<"search_history">
    const doc = await ctx.db.get(history_id);
    return doc?.result;
  },
})

export const getPrompt = internalQuery({
  args: { id: v.string()},
  handler: async (ctx, args) => {
    const history_id = args.id as Id<"search_history">
    const doc = await ctx.db.get(history_id);
    return doc?.prompt;
  },
})