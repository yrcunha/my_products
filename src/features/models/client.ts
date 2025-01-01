import { z } from "zod";

export const ClientModel = z
  .object({
    id: z.string().ulid(),
    name: z.string(),
    email: z.string().email(),
    status: z.boolean().default(true),
  })
  .strip();

export type ClientProps = z.infer<typeof ClientModel>;
