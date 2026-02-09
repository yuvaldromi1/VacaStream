import express, { Request, Response, Router } from "express";
import { asyncHandler, sendSuccess } from "@yd/restify";
import { reportService } from "../services/report.service";
import { requireAdmin } from "../middleware/role.middleware";

class ReportController {

    public readonly router: Router = express.Router();

    constructor() {
        this.router.get("/api/reports", requireAdmin, asyncHandler(this.getReport));
        this.router.get("/api/reports/csv", requireAdmin, asyncHandler(this.getCsv));
    }

    private getReport = async (req: Request, res: Response): Promise<void> => {
        const report = await reportService.getLikesReport();
        sendSuccess(res, report);
    };

    private getCsv = async (req: Request, res: Response): Promise<void> => {
        const csv = await reportService.getCsv();
        res.header("Content-Type", "text/csv");
        res.header("Content-Disposition", "attachment; filename=vacation-likes-report.csv");
        res.send(csv);
    };
}

export const reportController = new ReportController();
