import { Migrations } from "@convex-dev/migrations";
import { components } from "./_generated/api.js";
import { DataModel } from "./_generated/dataModel.js";
import { internal } from "./_generated/api.js";

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

// export const setCategoryToEmpty = migrations.define({
//   table: "products",
//   migrateOne: async (ctx, doc) => {
//     // Concatenate the three fields, e.g., fieldA, fieldB, fieldC
//     await ctx.db.patch(doc._id, { category: undefined });
//   },
// });

// export const runIt = migrations.runner(internal.migrations.setCategoryToEmpty);
