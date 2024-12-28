import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";

export class MethodNotAllowedError extends CustomError {
  constructor(message: string = "Method not allowed!") {
    super(message, ErrorCodes.MethodNotAllowed);
  }
}
