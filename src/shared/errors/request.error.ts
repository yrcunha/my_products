import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";

export class RequestError extends CustomError {
  constructor(message: string, error: Error) {
    super(message, ErrorCodes.InvalidCall, undefined, error);
  }
}
