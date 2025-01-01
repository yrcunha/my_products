import { z } from "zod";

export const DEFAULT_PAGE_SIZE = 1;
export const DEFAULT_LIMIT_PER_PAGE = 10;

export const PaginationModel = z
  .object({
    page: z.number().int().positive().catch(DEFAULT_PAGE_SIZE),
    limit: z.number().int().positive().catch(DEFAULT_LIMIT_PER_PAGE),
  })
  .strip();

export type PaginationProps = z.infer<typeof PaginationModel>;
