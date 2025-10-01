import { WorkflowManager } from "@convex-dev/workflow";
import { components, internal } from "../_generated/api";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { Doc } from "../_generated/dataModel";
import { internalMutation, mutation } from "../_generated/server";
import { vWorkflowId} from "@convex-dev/workflow";
import { vResultValidator } from "@convex-dev/workpool";

type SelfQueryingRetrievalResult = {
  semantic_query: string;
  keyword_query: string;
  filters: any; // Replace 'any' with your actual filter type if known
};

type VectorSearchResult = { id: Id<"products">; rank: number }[];
type FullTextSearchResult = { id: Id<"products">; rank: number }[];
type ReciprocalRankingResult = { id: Id<"products">; RRF_SCORE: number }[];

type Product = Doc<"products">;

type LLMRankingResult = {
  ranking: Array<{
    id: Id<"products">;
    rank: number;
    reason?: string;
  }>;
};

type FinalRanking = {
  searchId: Id<"search_history">;
  productId: Id<"products">;
  hybridScore: number;
  aiRank?: number;
  reason?: string;
};

type FinalResult = {
  output: LLMRankingResult;
  products: Array<{ _id: Id<"products"> }>;
};


export const workflow = new WorkflowManager(components.workflow);


export const handleHybridSearchComplete = internalMutation({
  args: {
    workflowId: vWorkflowId,
    result: vResultValidator,
    context: v.id("search_history"),
  },
  handler: async (ctx, args) => {

    if (args.result.kind === "failed") {
      await ctx.db.patch(args.context, {
        status: "error",
        error_message: args.result.error,
      });
    } else if (args.result.kind === "canceled") {
      await ctx.db.patch(args.context, {
        status: "error",
        error_message: "Workflow was canceled.",
      });
    }
    else{
      await ctx.db.patch(args.context, {
        status: "done",
        result: JSON.stringify(args.result.returnValue),
        error_message: "",
      });
    }
  },
});

export const HybridSearchWorkflow = workflow.define({
  args: {
    search_id: v.id("search_history"),
    user_query: v.string(),
  },
  handler: async (
    steps,
    args
  ): Promise<FinalResult> => {
    // 1. SelfQueryingRetrieval
    const {
      semantic_query,
      keyword_query,
      filters,
    }: SelfQueryingRetrievalResult = await steps.runAction(
      internal.products.actions.SelfQueryingRetrivalAction,
      { query: args.user_query }
    );

    await steps.runMutation(internal.search_history.mutations.UpdateSearchHistoryWorkflowStep, {
      id: args.search_id,
      step: "understanding_search",
    });


    // 2. Vector search
    const vector_search_results: VectorSearchResult = await steps.runAction(
      internal.products.actions.VS_Results,
      { semantic_query, filters }
    );

    // 3. Full text search
    const full_text_search_results: FullTextSearchResult = await steps.runQuery(
      internal.products.query.FTS_Results,
      { keyword_query, filters }
    );

    await steps.runMutation(internal.search_history.mutations.UpdateSearchHistoryWorkflowStep, {
      id: args.search_id,
      step: "finding_products",
    });

    // 4. Reciprocal ranking fusion
    const results: ReciprocalRankingResult = await steps.runAction(
      internal.products.actions.reciprocalRankingFusionAction,
      { lists: [vector_search_results, full_text_search_results] }
    );

     await steps.runMutation(internal.search_history.mutations.UpdateSearchHistoryWorkflowStep, {
      id: args.search_id,
      step: "sorting_options",
    });

    // 5. Fetch products by ID
    const products: Product[] = await steps.runQuery(
      internal.products.query.fetchResults,
      { ids: results.map((r) => r.id) }
    );

    // 6. LLM ranking
    const llm_ranking_results: LLMRankingResult = await steps.runAction(
      internal.products.actions.llmRankingAction,
      {
        query: args.user_query,
        results: products.slice(0,10).map((p) => ({
          _id: p._id,
          name: p.name,
          price: p.price,
          description: p.description,
          category: p.category,
          tags: p.tags,
        })),
      }
    );

     await steps.runMutation(internal.search_history.mutations.UpdateSearchHistoryWorkflowStep, {
      id: args.search_id,
      step: "choosing_fit",
    });

    // 7. Map and create rankings
    const final_Rankings: FinalRanking[] = results.map((item) => {
      const aiData = llm_ranking_results.ranking.find((r) => r.id === item.id);
      return {
        searchId: args.search_id,
        productId: item.id,
        hybridScore: item.RRF_SCORE,
        aiRank: aiData?.rank,
        reason: aiData?.reason,
      };
    });

    if (final_Rankings.length > 0) {
      await steps.runMutation(
        internal.rankings.mutations.createRankings,
        { rankings: final_Rankings }
      );
    }

    // 8. Update search history
    const final_result: FinalResult = {
      output: llm_ranking_results,
      products: products.map((p) => ({ _id: p._id })),
    };

     await steps.runMutation(internal.search_history.mutations.UpdateSearchHistoryWorkflowStep, {
      id: args.search_id,
      step: "preparing_results",
    });

    await steps.runMutation(
      internal.search_history.mutations.UpdateSearchHistory,
      {
        id: args.search_id,
        status: "done",
        result: JSON.stringify(final_result),
        error_message: "",
      }
    );

    return final_result;
  },
});


export const kickoffHybridSearch = internalMutation({
  args: {
    search_id: v.id("search_history"),
    user_query: v.string(),
  },
  handler: async (ctx, args) => {
    await workflow.start(
      ctx,
      internal.products.workflow.HybridSearchWorkflow,
      args,
      {
        onComplete: internal.products.workflow.handleHybridSearchComplete,
        context: args.search_id,
      }
    );
  },
});
