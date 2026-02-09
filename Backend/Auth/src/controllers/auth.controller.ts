import express, { Request, Response, Router } from "express";
import { asyncHandler, sendCreated, sendSuccess } from "@yd/restify";
import { authService } from "../services/auth.service";
import { RegisterModel, LoginModel } from "../models/user.model";

class AuthController {

    public readonly router: Router = express.Router();

    constructor() {
        this.router.post("/api/auth/register", asyncHandler(this.register));
        this.router.post("/api/auth/login", asyncHandler(this.login));
    }

    private register = async (req: Request, res: Response): Promise<void> => {
        const data: RegisterModel = req.body;
        const token = await authService.register(data);
        sendCreated(res, { token });
    };

    private login = async (req: Request, res: Response): Promise<void> => {
        const data: LoginModel = req.body;
        const token = await authService.login(data);
        sendSuccess(res, { token });
    };
}

export const authController = new AuthController();
