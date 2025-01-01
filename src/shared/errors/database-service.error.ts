import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";
import { PG_ERROR_CODES, SingleKeyViolationCode } from "@/features/providers/database";

type DatabaseErrorInfo = {
  code: string;
  constraint?: string;
  detail?: string;
};

export class DatabaseServiceError extends CustomError {
  constructor(message: string, info: DatabaseErrorInfo) {
    let details;
    let errorCode = ErrorCodes.Unknown;
    if (info.detail && info.constraint) details = [{ field: info.constraint, message: info.detail }];
    if (PG_ERROR_CODES.includes(info.code)) errorCode = ErrorCodes.InvalidDatabaseTransactionData;
    if (info.code === SingleKeyViolationCode) errorCode = ErrorCodes.ResourceAlreadyExists;

    super(
      `There was an error in the database operation with code ${info.code} and message: ${message}.`,
      errorCode,
      details,
    );
  }
}
