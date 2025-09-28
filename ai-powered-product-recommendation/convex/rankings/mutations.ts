import { mutation } from "../_generated/server";
import { rankingsFields } from "./schema";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export type aiSelections = {
    id: string,
    reasoning: string,
}[]

export const createRankings = mutation({
  args: { rankings: v.array(v.object(rankingsFields)) },
  handler: async (ctx, args) => {
     const aiSelections: aiSelections = [];
     const search_id = args.rankings[0].searchId;

     for (const ranking of args.rankings){
      const id = await ctx.db.insert("rankings", ranking)
      if (ranking.aiRank && [1, 2, 3].includes(ranking.aiRank)) {
        aiSelections.push({
          id,
          reasoning: ranking.reason || "",
        });
      }
     }
     
   if (aiSelections) {
      await ctx.scheduler.runAfter(0, internal.comparisons.actions.generateComparison, {
        search_id,
        aiSelections
      });
    }
  },
});



