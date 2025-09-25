import { defineSchema, defineTable } from "convex/server";
import { searchHistoryFields } from "./search_history/searchHistoryFields";
import { v } from "convex/values";

export default defineSchema({
  search_history: defineTable({...searchHistoryFields, user:v.id("users")} ),
  users: defineTable({
    name: v.string(),
    userId: v.string(), 
  }).index("by_userId", ["userId"]),
  products: defineTable({
    name: v.string(),
    category: v.array(v.string()),
    price: v.number(),
    image: v.string(),
    url: v.string(),
    description: v.string(),
    embedding: v.optional(v.array(v.float64()))
  }).vectorIndex("by_embedding", {
  vectorField: "embedding",
  dimensions: 768,
  filterFields: ["category"],
})
});


           