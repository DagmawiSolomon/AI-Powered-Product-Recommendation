import { internalAction } from "../_generated/server";
import { api, internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";
import { v } from "convex/values";
import { generateComparisonText } from "./helpers";
import { Id } from "../_generated/dataModel";

export const generateComparison = internalAction({
  args: {
    search_id: v.string(),
    aiSelections: v.array(
      v.object({
        id: v.string(),
        reasoning: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // 1. Get the prompt from search_history
    const prompt: string =
      (await ctx.runQuery(
        internal.search_history.query.getPrompt,
        { id: args.search_id }
      )) ?? "";

    // 2. Get the products' metadata
    const products: Doc<"products">[] = await ctx.runQuery(
      internal.products.query.fetchProducts,
      { ids: args.aiSelections.map(s => s.id) }
    );

    // 3. Build context for the LLM
    const context = products.map(p => {
      const selection = args.aiSelections.find(s => s.id === p._id);
      return {
        name: p.name,
        description: p.description,
        tags: p.tags,
        reasoning: selection ? selection.reasoning : "",
      };
    });

    // 4. Call a function or external API to generate the comparison
    const comparisonResult = await generateComparisonText({
      query: prompt,
      products: context,
    });

    // 5. Optionally, insert the result into the comparisons table
    await ctx.runMutation(internal.comparisons.mutations.createComparison, {searchId: args.search_id as Id<"search_history">, productIds: args.aiSelections.map(s => s.id) as Id<"products">[], text: comparisonResult.comparison });

    return comparisonResult;
  }
});