import { v } from "convex/values";

export const ComparisonFields = {
  searchId: v.id("search_history"),
  productIds: v.array(v.id("products")),
  text: v.string(),     
};