import { internalQuery, query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";
import { formatTimeAgo } from "./helper";


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


export const getPageData = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {

    const prompt:string = await ctx.runQuery(internal.search_history.query.getPrompt,{ id: args.id }) ?? "";
    // 1. Get all rankings for the given search_history
    const rankings = await ctx.db
      .query("rankings")
      .withIndex("by_searchId", (q) => q.eq("searchId", args.id as Id<"search_history">))
      .collect();

    // 2. Get all unique productIds from the rankings
    const productIds = Array.from(new Set(rankings.map(r => r.productId)));

    // 3. Fetch all products by their IDs
    const products = [];
    for (const productId of productIds) {
      const product = await ctx.db.get(productId);
      if (product) products.push(product);
    }

    // 4. Get the comparison associated with the search_history
    const comparison = await ctx.db
      .query("comparisons")
      .withIndex("by_searchId", (q) => q.eq("searchId", args.id as Id<"search_history">))
      .unique();

    // 5. Return everything formatted for easy parsing
    return {
      prompt,
      rankings,
      products,
      comparison,
    };
  },
});


type RecentActivity = {
  title: string,
  searchedBy: string,
  timeAgo: string,
}
//  title: "Best Wireless Headphones for Remote Work",
//   category: "Electronics",
//   searchedBy: "Sarah M.",
//   timeAgo: "2 hours ago",

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
          title: search.prompt,
          searchedBy: user?.name ?? "Unknown",
          timeAgo,
        };
      })
    );
  },
});