import express, { Request, Response, Router } from "express";
import { asyncHandler, sendSuccess, sendCreated, sendNoContent } from "@yd/restify";
import { vacationService } from "../services/vacation.service";
import { VacationModel } from "../models/vacation.model";
import { uploadMiddleware } from "../middleware/upload.middleware";
import { requireAdmin } from "../middleware/role.middleware";

class VacationController {

    public readonly router: Router = express.Router();

    constructor() {
        this.router.get("/api/vacations", asyncHandler(this.getAll));
        this.router.get("/api/vacations/:id", asyncHandler(this.getById));
        this.router.post("/api/vacations", requireAdmin, uploadMiddleware.single("image"), asyncHandler(this.create));
        this.router.put("/api/vacations/:id", requireAdmin, uploadMiddleware.single("image"), asyncHandler(this.update));
        this.router.delete("/api/vacations/:id", requireAdmin, asyncHandler(this.delete));
    }

    private getAll = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user!.userId;
        const vacations = await vacationService.getAll(userId);
        sendSuccess(res, vacations);
    };

    private getById = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        const vacation = await vacationService.getById(id);
        sendSuccess(res, vacation);
    };

    private create = async (req: Request, res: Response): Promise<void> => {
        req.body.price = Number(req.body.price);
        req.body.imageFileName = req.file?.filename || "";
        const vacation: VacationModel = req.body;
        const created = await vacationService.create(vacation);
        sendCreated(res, created);
    };

    private update = async (req: Request, res: Response): Promise<void> => {
        req.body.price = Number(req.body.price);
        const vacation: VacationModel = req.body;
        vacation.id = Number(req.params.id);
        if (req.file) {
            vacation.imageFileName = req.file.filename;
        }
        const updated = await vacationService.update(vacation);
        sendSuccess(res, updated);
    };

    private delete = async (req: Request, res: Response): Promise<void> => {
        const id = Number(req.params.id);
        await vacationService.delete(id);
        sendNoContent(res);
    };
}

export const vacationController = new VacationController();
