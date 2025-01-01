import { z } from "zod";

export const ReviewModel = z
  .object({
    score: z.number().positive(),
    message: z.string(),
    anonymous: z.boolean().default(true).optional(),
    reviewer: z.string().default("anonymous").optional(),
  })
  .strip();

export type ReviewProps = z.infer<typeof ReviewModel>;
