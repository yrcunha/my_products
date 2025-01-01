import { CustomError, ErrorCodes, ValidationErrorDetails } from "@/shared/errors/custom-errors";

export class InvalidPayloadError extends CustomError {
  constructor(details: ValidationErrorDetails[] = []) {
    super(`Error validating the request payload.`, ErrorCodes.InvalidPayload, details);
  }
}
