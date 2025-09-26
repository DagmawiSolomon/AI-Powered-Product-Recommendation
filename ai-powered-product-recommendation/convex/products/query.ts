import { internalQuery, query } from "../_generated/server";
import { v } from "convex/values";
import { Filter } from "../services/selfQueryingRetrival";
import { getEmbeddings } from "../services/embeddings";
import { internal } from "../_generated/api";
import { Doc } from "../_generated/dataModel";

function applyFilter<T>(
  q: any, 
  filter: any
) {
  const field = q.field(filter.field as any); // cast if schema mismatch

  switch (filter.operator) {
    case "=":
      return q.eq(field, filter.value);
    case "<":
      return q.lt(field, filter.value as number);
    case ">":
      return q.gt(field, filter.value as number);
    case "<=":
      return q.lte(field, filter.value as number);
    case ">=":
      return q.gte(field, filter.value as number);
    default:
      throw new Error(`Unsupported operator: ${filter.operator}`);
  }
}

export const fetchResults = internalQuery({
  args: { ids: v.array(v.id("products")) },
  handler: async (ctx, args) => {
    const results = [];
    for (const id of args.ids) {
      const doc = await ctx.db.get(id);
      if (doc === null) {
        continue;
      }
      results.push(doc);
    }
    return results;
  },
});


export const filterValidator = v.object({
  field: v.union(v.literal("price")),
  operator: v.union(
    v.literal("="),
    v.literal("<"),
    v.literal(">"),
    v.literal("<="),
    v.literal(">=")
  ),
  value: v.union(v.string(), v.number()),
});

export const FTS_Results = query({
  args: {
    keyword_query: v.string(),
    filters: v.optional(v.array(filterValidator)),
  },
  handler: async (ctx, { keyword_query, filters }) => {
    let query = ctx.db.query("products")
      .withSearchIndex("search_search_text", (q) =>
        q.search("search_text", keyword_query)
      );

      if(filters){
    
    for (const filter of filters) {
      query = applyFilter(query, filter);
    
    }
  }
    return query.collect();
  },
});


