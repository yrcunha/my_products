import { CustomError, ErrorCodes, ValidationErrorDetails } from "@/shared/errors/custom-errors";

export class InvalidContractForServiceError extends CustomError {
  constructor(service: string, url: string, details: ValidationErrorDetails[] = []) {
    super(
      `Error validating request response contract for service ${service} at url call ${url}.`,
      ErrorCodes.InvalidCallContract,
      details,
    );
  }
}
