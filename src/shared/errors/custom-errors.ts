export enum ErrorCodes {
  Unknown = "Unknown",
  InvalidPayload = "InvalidPayload",
  ResourceAlreadyExists = "ResourceAlreadyExists",
  ResourceNotFound = "ResourceNotFound",
  ServiceUnavailable = "ServiceUnavailable",
  MethodNotAllowed = "MethodNotAllowed",
  Unauthorized = "Unauthorized",
  ActionNotAllowed = "ActionNotAllowed",
  InvalidDatabaseTransactionData = "InvalidDatabaseTransactionData",
}

export type ErrorDetails = {
  key: string;
  message: string;
};

export class CustomError extends Error {
  public timestamp: string;
  public details?: ErrorDetails[];

  constructor(message: string, code: ErrorCodes = ErrorCodes.Unknown, details?: ErrorDetails[]) {
    super();
    super.name = code;
    super.message = message;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  static instanceMount(error: Error) {
    if (error instanceof CustomError) return error;
    if ("errors" in error && Array.isArray(error.errors)) {
      const details = error.errors.map<ErrorDetails>((item) => ({ key: "", message: item.message }));
      return new CustomError("Unexpected error with no message pattern.", ErrorCodes.Unknown, details);
    }
    return new CustomError(error.message);
  }
}
