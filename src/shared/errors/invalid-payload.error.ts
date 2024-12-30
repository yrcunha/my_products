import { CustomError, ErrorCodes, ErrorDetails } from "@/shared/errors/custom-errors";

export class InvalidPayloadError extends CustomError {
  constructor(details: ErrorDetails[] = []) {
    super(`Error validating the request payload.`, ErrorCodes.InvalidPayload, details);
  }
}
