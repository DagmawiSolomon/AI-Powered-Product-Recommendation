import { mutation } from "../_generated/server";
import { rankingsFields } from "./schema";
import { v } from "convex/values";

export const createRankings = mutation({
  args: { rankings: v.array(v.object(rankingsFields)) },
  handler: async (ctx, args) => {
     for (const ranking of args.rankings){
         await ctx.db.insert("rankings", ranking)
     }
    
  },
});