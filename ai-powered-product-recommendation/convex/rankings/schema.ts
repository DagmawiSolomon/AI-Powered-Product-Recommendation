import { v } from "convex/values";

export const rankingsFields = {
  searchId: v.id("search_history"),
  productId: v.id("products"),
  hybridScore: v.optional(v.number()),
  aiRank: v.optional(v.number()),
  reason: v.optional(v.string()),
};