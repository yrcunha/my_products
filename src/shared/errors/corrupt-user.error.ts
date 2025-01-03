import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";

export class CorruptUserError extends CustomError {
  constructor(message: string = "You do not have permission to perform the action") {
    super(message, ErrorCodes.CorruptUser);
  }
}
