import { defineSchema, defineTable } from "convex/server";
import { searchHistoryFields } from "./search_history/searchHistoryFields";
import { v } from "convex/values";

export default defineSchema({
  search_history: defineTable({...searchHistoryFields, user:v.id("users")} ),
  users: defineTable({
    name: v.string(),
    userId: v.string(), 
  }).index("by_userId", ["userId"]),
});