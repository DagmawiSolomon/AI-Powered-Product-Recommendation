import { v } from "convex/values";
import { use } from "react";

export const statusValidator = v.union(
  v.literal("pending"),
  v.literal("processing"),
  v.literal("done"),
  v.literal("error")
);

export const stepValidator = v.union(
  v.literal("understanding_search"),
  v.literal("finding_products"),
  v.literal("sorting_options"),
  v.literal("choosing_fit"),
  v.literal("preparing_results")
);

export const searchHistoryFields = {
  prompt: v.string(),
  status: statusValidator,
  step: v.optional(stepValidator),
  result: v.string(),
  updatedAt: v.number(),
  error_message: v.string(),
};