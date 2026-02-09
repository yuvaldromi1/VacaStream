import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "@yd/restify";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    if (req.user?.role !== "admin") {
        next(new ForbiddenError("Admin access required."));
        return;
    }
    next();
}

export function requireUser(req: Request, res: Response, next: NextFunction): void {
    if (req.user?.role !== "user") {
        next(new ForbiddenError("User access required."));
        return;
    }
    next();
}
