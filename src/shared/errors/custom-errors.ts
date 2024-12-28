export enum ErrorCodes {
  Unknown = "Unknown",
  InvalidPayload = "InvalidPayload",
  ResourceAlreadyExists = "ResourceAlreadyExists",
  ResourceNotFound = "ResourceNotFound",
  ServiceUnavailable = "ServiceUnavailable",
  MethodNotAllowed = "MethodNotAllowed",
  Unauthorized = "Unauthorized",
  ActionNotAllowed = "ActionNotAllowed",
}

export class CustomError extends Error {
  public timestamp: string;
  public details?: string[];

  constructor(message: string, code: ErrorCodes = ErrorCodes.Unknown, details?: string[]) {
    super();
    super.name = code;
    super.message = message;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  static instanceMount(error: Error) {
    if (error instanceof CustomError) return error;
    if ("message" in error) new CustomError(error.message);

    let details;
    if ("errors" in error && Array.isArray(error.errors)) details = error.errors.map((item) => item.message);
    return new CustomError("Unexpected error with no message pattern.", ErrorCodes.Unknown, details);
  }
}
