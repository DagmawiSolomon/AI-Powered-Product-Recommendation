import { internalMutation, mutation } from "../_generated/server";
import { searchHistoryFields } from "./schema";
import { authComponent } from "../auth";
import { api } from "../_generated/api";
import { internal } from "../_generated/api";
import { AnyApi } from "convex/server";
import { v } from "convex/values";



export const createSearchHistory = mutation({
  args: searchHistoryFields,
  handler: async (ctx, args) => {
  
    const currentUser = await authComponent.getAuthUser(ctx);
  
    const userID = currentUser._id; 
    const user = await ctx.runQuery(api.search_history.query.getUserByUserId, { userId: userID });
   

      if (!user) {
    throw new Error("User not found in users table");
  }

  const search_history_id:any = await ctx.db.insert("search_history", {
    prompt: args.prompt,
    status: args.status,
    result: args.result,
    updatedAt: args.updatedAt,
    error_message: args.error_message,
    user: user._id, 
  });

  return search_history_id;
    },
});

export const UpdateSearchHistory = internalMutation({
  args: {id: v.id("search_history"), status: v.union(
    v.literal("pending"),
    v.literal("processing"),
    v.literal("done"),
    v.literal("error")
), result: v.string(), error_message: v.string()},

  handler:  async (ctx, args) =>{
    await ctx.db.patch(args.id, {
      status: args.status,
      result: args.result,
      error_message: args.error_message,
      updatedAt: Date.now(),
    });
    }
  
})

export const UpdateSearchHistoryWorkflowStep = internalMutation({
  args: {
    id: v.id("search_history"),
    step: v.union(
      v.literal("understanding_search"),
      v.literal("finding_products"),
      v.literal("sorting_options"),
      v.literal("choosing_fit"),
      v.literal("preparing_results")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { step: args.step });
  },
});
