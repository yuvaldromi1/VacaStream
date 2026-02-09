import express, { Request, Response, Router } from "express";
import { asyncHandler, sendCreated, sendNoContent } from "@yd/restify";
import { likeService } from "../services/like.service";
import { requireUser } from "../middleware/role.middleware";

class LikeController {

    public readonly router: Router = express.Router();

    constructor() {
        this.router.post("/api/likes/:vacationId", requireUser, asyncHandler(this.like));
        this.router.delete("/api/likes/:vacationId", requireUser, asyncHandler(this.unlike));
    }

    private like = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user!.userId;
        const vacationId = Number(req.params.vacationId);
        await likeService.like(userId, vacationId);
        sendCreated(res, { message: "Vacation liked successfully." });
    };

    private unlike = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user!.userId;
        const vacationId = Number(req.params.vacationId);
        await likeService.unlike(userId, vacationId);
        sendNoContent(res);
    };
}

export const likeController = new LikeController();
