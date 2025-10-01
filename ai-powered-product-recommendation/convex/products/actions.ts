import { v } from "convex/values";
import { action, internalAction } from "../_generated/server";
import { getEmbeddings } from "../services/embeddings";
import { api, internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { filterValidator } from "./query";
import { useAction } from "convex/react";
import { semanticQueryParser } from "../services/selfQueryingRetrival";
import { int } from "better-auth";
import { ReciprocalRankingFusion } from "../services/reciprocal_ranking_fusion";
import { llm_ranking, LLM_RESPONSE, Product_Metadata} from "../services/llm_ranking";
import { createRankings } from "../rankings/mutations";
import type { Rankings } from "../rankings/helpers";

export const VS_Results = internalAction({
  args: {
    semantic_query: v.string(),
    filters: v.optional(v.array(filterValidator)),
  },
  handler: async (ctx, args) => {
    // Step 1: Generate embedding
    const embeddingArray = await getEmbeddings([args.semantic_query]);
    const embedding = embeddingArray[0];
    if (!embedding) throw new Error("Failed to generate embedding");

    // Step 2: Run vector search
    const results = await ctx.vectorSearch("products", "by_embedding", {
      vector: embedding,
      limit: 50, 
    });

   
    const rankedResults = results
  .filter(r => r._score >= 0.8)
  .map((r, i) => ({ id: r._id, rank: i }));

  let products: Array<Doc<"products">> = await ctx.runQuery(
  internal.products.query.fetchResults,
  { ids: rankedResults.map(r => r.id) }
);

  
    // Step 4: Apply filters manually
    if (args.filters) {
      for (const filter of args.filters) {
        products = products.filter((p) => {
          const fieldValue = (p as any)[filter.field];

          switch (filter.operator) {
            case "=":
              return fieldValue === filter.value;
            case "<":
              return fieldValue < filter.value;
            case ">":
              return fieldValue > filter.value;
            case "<=":
              return fieldValue <= filter.value;
            case ">=":
              return fieldValue >= filter.value;
            default:
              throw new Error(`Unsupported operator: ${filter.operator}`);
          }
        });

      }
    }
    return rankedResults.filter(r => products.some(p => p._id === r.id));
  },
});


type RankingInput = Omit<Rankings, "_id" | "_creationTime">

export type ProductPreview = {
  _id: Id<"products">;  
};

export type llm_ranking_json = {
  output: LLM_RESPONSE
  products: ProductPreview[]
}


export const SelfQueryingRetrivalAction  = internalAction({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await semanticQueryParser(args.query)
    return response;
  }
})

export const reciprocalRankingFusionAction = internalAction({
  args: {
    lists: v.array(
      v.array(
        v.object({
          id: v.id("products"),
          rank: v.number(),
        })
      )
    ),
    k: v.optional(v.number()),
  },
  handler: async (_ctx, args) => {
    return ReciprocalRankingFusion(args.lists, args.k ?? 60);
  },
});

export const llmRankingAction = internalAction({
  args: {
    query: v.string(),
    results: v.array(
      v.object({
        _id: v.id("products"),
        name: v.string(),
        description: v.string(),
        category: v.string(),
        tags: v.array(v.string()),
        price: v.number(),
      })
    ),
  },
  handler: async (_ctx, args) => {
    return await llm_ranking({
      query: args.query,
      results: args.results,
    });
  },
});

export const HybridSearchWorkFlow = internalAction({
  args: {
    search_id: v.id("search_history"),
    user_query: v.string(),
  },
  handler: async (ctx, args) => {
    // step1: SelfQueryingRetrival
    const {semantic_query, filters, keyword_query} = await semanticQueryParser(args.user_query);
    const vector_search_results = await ctx.runAction(internal.products.actions.VS_Results,{
      semantic_query,
      filters,
    });

    const full_text_search_results = await ctx.runQuery(internal.products.query.FTS_Results,{
      keyword_query,
      filters
    })

    const results = await ReciprocalRankingFusion([vector_search_results, full_text_search_results]);
    
    
    const products: Array<Doc<"products">>= await ctx.runQuery(internal.products.query.fetchResults,{
        ids: results.map(r => r.id)
    }
    )

    const llm_ranking_results = await llm_ranking({
      query: args.user_query,
      results:products.map(p => ({
        _id: p._id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price,
        tags: p.tags
      }))
    })

    const final_Rankings: RankingInput[] = results.map((item, index) => {
      const aiData = llm_ranking_results.ranking.find(r => r.id ===item.id);
      return {
        searchId: args.search_id as Id<'search_history'>,
        productId: item.id as Id<'products'>,
        hybridScore: item.RRF_SCORE,
        aiRank: aiData?.rank,
        reason: aiData?.reason,
      };
    });

    if(final_Rankings && final_Rankings.length > 0){
      await ctx.runMutation(internal.rankings.mutations.createRankings, {rankings: final_Rankings});
    }
    

    const final_result:  llm_ranking_json = {
      output:llm_ranking_results,
      products: products.map(p => ({ _id: p._id,}))}

    await ctx.runMutation(internal.search_history.mutations.UpdateSearchHistory, {
      id: args.search_id as Id<'search_history'>,
      status: "done",
      result: JSON.stringify(final_result),
      error_message: ""
    });
    // update search_history status and save in the database
    
  
    return final_result

  }
})


