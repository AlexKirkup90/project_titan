import { z } from "zod";

export const terraWebhookSchema = z.object({
  id: z.string().min(1),
  user_id: z.string().min(1),
  source: z.enum(["oura", "whoop", "apple_health"]),
  metric_type: z.string().min(1),
  payload: z.record(z.unknown()),
  received_at: z.string().datetime().optional()
});

export type TerraWebhookEvent = z.infer<typeof terraWebhookSchema>;

export const subjectiveLogSchema = z.object({
  user_id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  rpe: z.number().min(1).max(10),
  friction: z.number().min(1).max(10),
  notes: z.string().max(3000).default("")
});

export type SubjectiveLog = z.infer<typeof subjectiveLogSchema>;
