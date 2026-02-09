import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@yd/restify";
import { JwtPayload, verifyToken } from "./jwt.js";

// Extend Express Request type to include JWT payload:
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function jwtMiddleware(req: Request, res: Response, next: NextFunction): void {
    // Extract token from "Authorization: Bearer <token>" header:
    const authorization = req.header("authorization");
    const token = authorization?.substring(7);

    if (!token) {
        next(new UnauthorizedError("You are not logged in."));
        return;
    }

    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch {
        next(new UnauthorizedError("Invalid or expired token."));
    }
}
