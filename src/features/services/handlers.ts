import { NextFunction, Request, Response } from "express";
import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";
import { MapErrors } from "@/shared/http/http";
import { MethodNotAllowedError } from "@/shared/errors/method-not-allowed.error";

export function methodNotAllowed(req: Request, res: Response) {
  res
    .status(MapErrors[ErrorCodes.MethodNotAllowed])
    .json(new MethodNotAllowedError(`${req.method} method to path -- ${req.url} -- is not allowed!`));
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  const response = CustomError.instanceMount(error);
  res.status(MapErrors[response.name]).json(response);
}
