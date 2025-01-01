import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";
import { Method } from "@/features/providers/request";

export class CallUnavailableError extends CustomError {
  constructor(url: string, method: Method, status: number, error: Error) {
    super(
      `Error calling method ${method} and url ${url} with status return ${status}.`,
      ErrorCodes.ProblemsOnTheCallServer,
      undefined,
      error,
    );
  }
}
