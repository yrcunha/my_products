import { NextFunction, Request, Response } from "express";
import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";
import { MapErrors } from "@/shared/http/http";
import { MethodNotAllowedError } from "@/shared/errors/method-not-allowed.error";
import logger from "@/shared/logger/logger";

export function methodNotAllowed(req: Request, res: Response) {
  const response = new MethodNotAllowedError(`${req.method} method to path -- ${req.url} -- is not allowed!`);
  logger.info(
    response,
    `Error for call made to url [${req.url}] method [${req.method.toUpperCase()}] is invalid as the method does not exist.`,
  );
  res.status(MapErrors[ErrorCodes.MethodNotAllowed]).json();
}

export function errorHandler(error: Error, req: Request, res: Response, _next: NextFunction) {
  const response = CustomError.instanceMount(error);
  logger.info(response, `Error for call made to url [${req.url}] method [${req.method.toUpperCase()}].`);
  res.status(MapErrors[response.name]).json(response);
}

export function loggingHandler({ body, headers, url, method }: Request, _res: Response, next: NextFunction) {
  logger.info({ body, headers }, `Call made to url [${url}] method [${method.toUpperCase()}].`);
  next();
}
