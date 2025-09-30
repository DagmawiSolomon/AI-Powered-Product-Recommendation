import { internalMutation, mutation } from "../_generated/server";
import { rankingsFields } from "./schema";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

export type aiSelections = {
    id: Id<"products">,
    reasoning: string,
}[]

export const createRankings = internalMutation({
  args: { rankings: v.array(v.object(rankingsFields)) },
  handler: async (ctx, args) => {
     const aiSelections: aiSelections = [];
     const search_id = args.rankings[0].searchId;

     for (const ranking of args.rankings){
      await ctx.db.insert("rankings", ranking)
      if (ranking.aiRank && [1, 2, 3].includes(ranking.aiRank)) {
        aiSelections.push({
          id: ranking.productId,
          reasoning: ranking.reason || "",
        });
      }
     }
   if (aiSelections && aiSelections.length > 0) {
      await ctx.scheduler.runAfter(0, internal.comparisons.actions.generateComparison, {
        search_id,
        aiSelections
      });
    }
  },
});



