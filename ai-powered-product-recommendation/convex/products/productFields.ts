import {v} from "convex/values"

export const productFields = {
    name: v.string(),
    category: v.string(),
    price: v.number(),
    image: v.string(),
    url: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
    embedding: v.optional(v.array(v.float64())),
    search_text: v.string(),
}