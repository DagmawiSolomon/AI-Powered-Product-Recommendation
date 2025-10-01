import { internalQuery, query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";
import { formatTimeAgo } from "./helper";
import { authComponent } from "../auth";
import { api } from "../_generated/api";



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

export const getProduct = internalQuery({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});


export const getPageData = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {

    const prompt:string = await ctx.runQuery(internal.search_history.query.getPrompt,{ id: args.id }) ?? "";
    // 1. Get all rankings for the given search_history
    const rankings = await ctx.db
      .query("rankings")
      .withIndex("by_searchId", (q) => q.eq("searchId", args.id as Id<"search_history">))
      .collect();

    // 4. Get the comparison associated with the search_history
    const comparison = await ctx.db
      .query("comparisons")
      .withIndex("by_searchId", (q) => q.eq("searchId", args.id as Id<"search_history">))
      .unique();

    
    const comparisonProducts = await Promise.all(
  (comparison?.productIds ?? []).map((productId) => ctx.db.get(productId))
);
    


    // 5. Return everything formatted for easy parsing
    return {
      prompt,
      rankings,
      comparisonProducts,
      comparison,
    };
  },
});


type RecentActivity = {
  id: string
  title: string,
  searchedBy: string,
  timeAgo: string,
}
export const getRecentActivity = query({
  args: {},
  handler: async (ctx, args) => {
    const recent_searches = await ctx.db
      .query("search_history")
      .withIndex("by_updatedAt", (q) => q)
      .order("desc")
      .take(5);

    return await Promise.all(
      recent_searches.map(async (search) => {
       
        const user = await ctx.db.get(search.user); 
        const timeAgo = formatTimeAgo(search._creationTime); 

        return {
          id: search._id,
          title: search.prompt,
          searchedBy: user?.name ?? "Unknown",
          timeAgo,
        };
      })
    );
  },
});

export const getSearchHistory = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await authComponent.getAuthUser(ctx);

    if (!currentUser._id) {
      throw new Error("User ID is missing");
    }

    // Find the user in your Convex "users" table by userId
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", currentUser._id!))
      .unique();

    if (!user) {
      throw new Error("User not found in users table");
    }

    // Query the search_history table for this user
    const history = await ctx.db
      .query("search_history")
      .withIndex("by_user", (q) => q.eq("user", user._id))
      .order("desc")
      .collect()
    
   
      

    
    return history.map((search) => ({
      id: search._id as string,
      query: search.prompt, 
      timestamp: search.updatedAt, 
    }));
  }
});

export const getSearchHistoryStep = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const history_id = args.id as Id<"search_history">
    const doc = await ctx.db.get(history_id);
    return doc?.step;
  }
})