import { NextFunction, Request, Response } from "express";
import { StatusCode } from "./enums.js";
import { AppError, NotFoundError } from "./client-errors.js";

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void {
    // Log error to console:
    console.error(err);

    // Determine status code:
    const status = err instanceof AppError ? err.status : StatusCode.InternalServerError;

    // Hide internal error details from client:
    const isServerError = status >= 500 && status <= 599;
    const message = isServerError ? "Internal server error." : err.message;

    // Send error response:
    res.status(status).json({ success: false, error: message });
}

export function routeNotFound(req: Request, res: Response, next: NextFunction): void {
    next(new NotFoundError(`Route ${req.originalUrl} not found.`));
}
