import { v } from "convex/values";

export const statusValidator = v.union(
  v.literal("pending"),
  v.literal("processing"),
  v.literal("done"),
  v.literal("error")
);

export const searchHistoryFields = {
  prompt: v.string(),
  status: statusValidator,
  result: v.string(),
  updatedAt: v.number(),
  error_message: v.string(),
};