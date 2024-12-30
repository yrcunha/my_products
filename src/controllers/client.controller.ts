import { ClientModel } from "@/features/models/client";
import { ulid } from "ulid";
import { Request, Response } from "express";
import { HttpCodes } from "@/shared/http/http";
import {
  changeStatus,
  createClient,
  getAllClients,
  getClientById,
  updateClient,
} from "@/features/services/client.service";
import { InvalidPayloadError } from "@/shared/errors/invalid-payload.error";
import { ResourceNotFoundError } from "@/shared/errors/resource-not-found.error";
import { mapZodErrorDetails } from "@/shared/utils/map-zod-error-details";
import { PaginationModel } from "@/features/models/pagination";

export async function create(req: Request, res: Response) {
  const model = ClientModel.safeParse({ id: ulid(), ...req.body });
  if (!model.success) throw new InvalidPayloadError(mapZodErrorDetails(model.error?.issues));
  const insertId = await createClient(model.data);
  res.status(HttpCodes.Created).json({ insert_id: insertId });
}

export async function getAll(req: Request, res: Response) {
  const model = PaginationModel.parse(req.query);
  const result = await getAllClients(model);
  res.status(HttpCodes.OK).json(result);
}

export async function getById(req: Request, res: Response) {
  const model = await getClientById(req.params.id);
  if (!model) throw new ResourceNotFoundError("Client");
  res.status(HttpCodes.OK).json(model);
}

export async function update(req: Request, res: Response) {
  const model = ClientModel.omit({ id: true }).partial().safeParse(req.body);
  if (!model.success) throw new InvalidPayloadError(mapZodErrorDetails(model.error?.issues));
  const nMatched = await updateClient(req.params.id, model.data);
  if (nMatched === 0) throw new ResourceNotFoundError("Client");
  res.status(HttpCodes.NotContent).end();
}

export async function remove(req: Request, res: Response) {
  const nMatched = await changeStatus(req.params.id, false);
  if (nMatched === 0) throw new ResourceNotFoundError("Client");
  res.status(HttpCodes.NotContent).end();
}
