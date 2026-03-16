import { z } from "zod";

const NullableNumber = z.number().nullable();

export const episodeSchema = z.object({
  episode_id: z.string().min(1),
  block_a_state: z.object({
    oura_readiness: NullableNumber,
    oura_hrv_ms: NullableNumber,
    oura_sleep_duration_mins: NullableNumber,
    medichecks_latest_ferritin_ugL: NullableNumber,
    calendar_load_hours: NullableNumber
  }),
  block_b_action: z.object({
    prescribed_training: z.string().nullable(),
    target_protein_g: NullableNumber,
    supplementation: z.array(z.string())
  }),
  block_c_reward: z.object({
    t_plus_1_hrv_delta: NullableNumber,
    t_plus_1_rpe: NullableNumber,
    cronometer_compliance_score: NullableNumber
  }),
  metadata: z.object({
    tags: z.array(z.string()).default([]),
    null_reasons: z.record(z.string()).default({})
  })
});

export type Episode = z.infer<typeof episodeSchema>;

const REQUIRED_NULLABLE_PATHS = [
  "block_a_state.oura_readiness",
  "block_a_state.oura_hrv_ms",
  "block_a_state.oura_sleep_duration_mins",
  "block_a_state.medichecks_latest_ferritin_ugL",
  "block_a_state.calendar_load_hours",
  "block_b_action.prescribed_training",
  "block_b_action.target_protein_g"
] as const;

function getPathValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, segment) => {
    if (typeof acc === "object" && acc !== null && segment in acc) {
      return (acc as Record<string, unknown>)[segment];
    }

    return undefined;
  }, obj);
}

export function validateEpisodeQuality(episode: Episode): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const path of REQUIRED_NULLABLE_PATHS) {
    const value = getPathValue(episode as unknown as Record<string, unknown>, path);
    if (value === null) {
      const nullReason = episode.metadata.null_reasons[path];
      if (!nullReason) {
        errors.push(`Missing null reason for required field: ${path}`);
      }
    }

    if (value === undefined) {
      errors.push(`Missing required field: ${path}`);
    }
  }

  return { ok: errors.length === 0, errors };
}
