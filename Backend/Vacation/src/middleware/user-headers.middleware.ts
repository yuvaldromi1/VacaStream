import { Request, Response, NextFunction } from "express";

// User payload passed from Gateway via custom headers:
export interface UserPayload {
    userId: number;
    role: "user" | "admin";
    firstName: string;
    lastName: string;
}

// Extend Express Request type to include user payload:
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export function parseUserHeaders(req: Request, _res: Response, next: NextFunction): void {
    const userId = req.header("x-user-id");
    if (userId) {
        req.user = {
            userId: Number(userId),
            role: (req.header("x-user-role") || "user") as "user" | "admin",
            firstName: req.header("x-user-firstname") || "",
            lastName: req.header("x-user-lastname") || "",
        };
    }
    next();
}
