import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";

export class UnauthorizedError extends CustomError {
  constructor(message: string = "Unauthorized!") {
    super(message, ErrorCodes.Unauthorized);
  }
}
