import { StatusCode } from "./enums.js";

export class AppError extends Error {
    public readonly status: StatusCode;

    public constructor(status: StatusCode, message: string) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
    }
}

export class NotFoundError extends AppError {
    public constructor(message: string = "Resource not found.") {
        super(StatusCode.NotFound, message);
    }
}

export class ValidationError extends AppError {
    public constructor(message: string) {
        super(StatusCode.BadRequest, message);
    }
}

export class UnauthorizedError extends AppError {
    public constructor(message: string = "You are not authorized.") {
        super(StatusCode.Unauthorized, message);
    }
}

export class ForbiddenError extends AppError {
    public constructor(message: string = "Access forbidden.") {
        super(StatusCode.Forbidden, message);
    }
}

export class ConflictError extends AppError {
    public constructor(message: string) {
        super(StatusCode.Conflict, message);
    }
}
