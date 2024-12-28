import { ErrorCodes } from "@/shared/errors/custom-errors";

export enum HttpCodes {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  Conflict = 409,
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
  [ErrorCodes.Unknown.valueOf()]: HttpCodes.InternalServerError,
  [ErrorCodes.ServiceUnavailable.valueOf()]: HttpCodes.ServiceUnavailable,
} as const;
