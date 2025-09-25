import {v} from "convex/values"

export const productFields = {
    name: v.string(),
    category: v.array(v.string()),
    price: v.number(),
    image: v.string(),
    url: v.string(),
    description: v.string(),
    embedding: v.optional(v.array(v.float64()))
}