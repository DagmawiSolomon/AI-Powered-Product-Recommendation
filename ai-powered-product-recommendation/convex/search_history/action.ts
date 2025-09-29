import { action } from "../_generated/server";
import { v } from "convex/values";
import { AIAssistant } from "./helper";

// Define the action
export const getAIResponseAction = action({
  args: {
    query: v.string(),
    context: v.array(
      v.object({
        product_id: v.string(),
        name: v.string(),
        description: v.string(),
        tags: v.array(v.string()),
        price: v.number(),
        aiRank: v.string(),
        reasoning: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
   const response = await AIAssistant({
      query: args.query,
      context: args.context,
    });
    console.log(response)
    console.error(response)
    return response;
  
    
  },
});