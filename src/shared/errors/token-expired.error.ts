import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";

export class TokenExpiredError extends CustomError {
  constructor(message: string = "Refresh token expired") {
    super(message, ErrorCodes.TokenExpired);
  }
}
