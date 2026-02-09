import { Response } from "express";
import { StatusCode } from "./enums.js";

export function sendSuccess<T>(res: Response, data: T, status: number = StatusCode.OK): void {
    res.status(status).json({ success: true, data });
}

export function sendCreated<T>(res: Response, data: T): void {
    res.status(StatusCode.Created).json({ success: true, data });
}

export function sendNoContent(res: Response): void {
    res.status(StatusCode.NoContent).send();
}
