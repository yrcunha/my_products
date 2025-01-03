export enum ErrorCodes {
  Unknown = "Unknown",
  InvalidPayload = "InvalidPayload",
  ResourceAlreadyExists = "ResourceAlreadyExists",
  ResourceNotFound = "ResourceNotFound",
  ServiceUnavailable = "ServiceUnavailable",
  MethodNotAllowed = "MethodNotAllowed",
  Unauthorized = "Unauthorized",
  ActionNotAllowed = "ActionNotAllowed",
  CorruptUser = "CorruptUser",
  InvalidDatabaseTransactionData = "InvalidDatabaseTransactionData",
  ProblemsOnTheCallServer = "ProblemsOnTheCallServer",
  InvalidCall = "InvalidCall",
  InvalidCallContract = "InvalidCallContract",
  TokenExpired = "TokenExpired",
}

export type ValidationErrorDetails = {
  field: string;
  message: string;
};

export class CustomError extends Error {
  public timestamp: string;
  public details?: ValidationErrorDetails[];
  public rawErrors?: Error | Error[];

  constructor(
    message: string,
    code: ErrorCodes = ErrorCodes.Unknown,
    details?: ValidationErrorDetails[],
    rawErrors?: Error | Error[],
  ) {
    super();
    super.name = code;
    super.message = message;
    this.details = details;
    this.rawErrors = rawErrors;
    this.timestamp = new Date().toISOString();
  }

  static instanceMount(error: Error) {
    if (error instanceof CustomError) return error;
    if ("errors" in error && Array.isArray(error.errors)) {
      return new CustomError("Unexpected error with no message pattern.", ErrorCodes.Unknown, undefined, error.errors);
    }
    return new CustomError(error.message);
  }
}
