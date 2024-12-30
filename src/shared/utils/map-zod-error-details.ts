import { ZodIssue } from "zod";
import { ErrorDetails } from "@/shared/errors/custom-errors";

export function mapZodErrorDetails(issues: ZodIssue[] = []) {
  return issues.map<ErrorDetails>((issue) => ({ key: issue.path.join("."), message: issue.message }));
}
