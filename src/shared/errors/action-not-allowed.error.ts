import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";

export class ActionNotAllowedError extends CustomError {
  constructor(message: string = "You do not have permission to perform the action") {
    super(message, ErrorCodes.ActionNotAllowed);
  }
}
