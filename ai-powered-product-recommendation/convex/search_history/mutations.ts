import { mutation } from "../_generated/server";
import { searchHistoryFields } from "./searchHistoryFields";
import { authComponent } from "../auth";
import { api } from "../_generated/api";



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
