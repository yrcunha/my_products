import { z } from "zod";

export const ProductModel = z
  .object({
    id: z.string(),
    price: z.number(),
    image: z.string().url(),
    brand: z.string(),
    title: z.string(),
    reviewScore: z.number().nonnegative().catch(0),
    state: z.enum(["available", "unavailable"]).default("available"),
  })
  .strip();

export type ProductProps = z.infer<typeof ProductModel>;
