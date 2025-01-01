import { ErrorCodes } from "@/shared/errors/custom-errors";

export enum HttpCodes {
  OK = 200,
  Created = 201,
  NotContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  Conflict = 409,
  UnprocessableEntity = 422,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

export const MapErrors = {
  [ErrorCodes.InvalidPayload.valueOf()]: HttpCodes.BadRequest,
  [ErrorCodes.Unauthorized.valueOf()]: HttpCodes.Unauthorized,
  [ErrorCodes.ActionNotAllowed.valueOf()]: HttpCodes.Forbidden,
  [ErrorCodes.ResourceNotFound.valueOf()]: HttpCodes.NotFound,
  [ErrorCodes.MethodNotAllowed.valueOf()]: HttpCodes.MethodNotAllowed,
  [ErrorCodes.ResourceAlreadyExists.valueOf()]: HttpCodes.Conflict,
  [ErrorCodes.InvalidDatabaseTransactionData.valueOf()]: HttpCodes.UnprocessableEntity,
  [ErrorCodes.InvalidCall.valueOf()]: HttpCodes.UnprocessableEntity,
  [ErrorCodes.Unknown.valueOf()]: HttpCodes.InternalServerError,
  [ErrorCodes.ServiceUnavailable.valueOf()]: HttpCodes.ServiceUnavailable,
  [ErrorCodes.ProblemsOnTheCallServer.valueOf()]: HttpCodes.ServiceUnavailable,
  [ErrorCodes.InvalidCallContract.valueOf()]: HttpCodes.ServiceUnavailable,
} as const;
