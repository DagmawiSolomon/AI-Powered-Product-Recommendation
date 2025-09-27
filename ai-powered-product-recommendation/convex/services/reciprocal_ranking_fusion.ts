import { Id } from "../_generated/dataModel";

export function ReciprocalRankingFusion(
  lists: Array<Array<{ id: Id<'products'>; rank: number }>>,
  k: number = 60
) {
  const scores = new Map<Id<'products'>, number>();

  for (const list of lists) {
    for (const { id, rank } of list) {
      const prev = scores.get(id) ?? 0;
      scores.set(id, prev + 1 / (k + rank + 1));
    }
  }

  return Array.from(scores.entries())
    .map(([id, score]) => ({ id, RRF_SCORE: score }))
    .sort((a, b) => b.RRF_SCORE - a.RRF_SCORE);
}
