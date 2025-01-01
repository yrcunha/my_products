import { Request, Response } from "express";
import { ResourceNotFoundError } from "@/shared/errors/resource-not-found.error";
import { HttpCodes } from "@/shared/http/http";
import { addItem, changeItem, getAllItems, getItemById } from "@/features/services/favorites-list.service";
import { PaginationModel } from "@/features/models/pagination";

export async function add(req: Request, res: Response) {
  await addItem(req.params.id, req.body.product_id);
  res.status(HttpCodes.NotContent).end();
}

export async function remove(req: Request, res: Response) {
  const nMatched = await changeItem(req.params.id, req.params.product_id, false);
  if (nMatched === 0) throw new ResourceNotFoundError("Client");
  res.status(HttpCodes.NotContent).end();
}

export async function getById(req: Request, res: Response) {
  const model = await getItemById(req.params.id, req.params.product_id);
  if (!model) throw new ResourceNotFoundError("Product");
  res.status(HttpCodes.OK).json(model);
}

export async function getAll(req: Request, res: Response) {
  const model = PaginationModel.parse(req.query);
  const result = await getAllItems(req.params.id, model);
  res.status(HttpCodes.OK).json(result);
}
