import { z } from "zod";

export const DEFAULT_PAGE_SIZE = 1;
export const DEFAULT_LIMIT_PER_PAGE = 10;

const defineValue = (defaultValue: number) => () => defaultValue;

export const PaginationModel = z.object({
  page: z.number().int().positive().default(DEFAULT_PAGE_SIZE).or(z.string()).transform(defineValue(DEFAULT_PAGE_SIZE)),
  limit: z
    .number()
    .int()
    .positive()
    .default(DEFAULT_LIMIT_PER_PAGE)
    .or(z.string())
    .transform(defineValue(DEFAULT_LIMIT_PER_PAGE)),
});

export type PaginationProps = z.infer<typeof PaginationModel>;
