import { ZodIssue } from "zod";
import { ValidationErrorDetails } from "@/shared/errors/custom-errors";

export function mapZodErrorDetails(issues: ZodIssue[] = []) {
  return issues.map<ValidationErrorDetails>((issue) => ({ field: issue.path.join("."), message: issue.message }));
}
