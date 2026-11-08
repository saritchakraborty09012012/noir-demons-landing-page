import type { PlanMode } from "../content/content";

/**
 * Scroll windows for the S07 deck. Managed pricing cycles first; at FLIP the
 * whole deck turns over to the one-time source-code plans and cycles again.
 */
export const PLAN_FLIP = 0.824;

export const PLAN_SPAN: Record<PlanMode, { from: number; to: number }> = {
  managed: { from: 0.788, to: PLAN_FLIP },
  source: { from: PLAN_FLIP, to: 0.862 },
};

/** Progress value parked on a single plan, used when a HUD tab is clicked. */
export const planCenter = (mode: PlanMode, index: number) => {
  const { from, to } = PLAN_SPAN[mode];
  return from + ((index + 0.5) / 4) * (to - from);
};
