import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";

export class ResourceNotFoundError extends CustomError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found.`, ErrorCodes.ResourceNotFound);
  }
}
