import { appConfig } from "./utils/app-config";
import express from "express";
import path from "path";
import { parseUserHeaders } from "./middleware/user-headers.middleware";
import { vacationController } from "./controllers/vacation.controller";
import { likeController } from "./controllers/like.controller";
import { reportController } from "./controllers/report.controller";
import { errorMiddleware, routeNotFound } from "@yd/restify";

class App {

    public start(): void {
        try {
            const server = express();
            server.use(express.json());

            // Serve uploaded images (no auth needed):
            server.use("/api/vacations/images", express.static(path.join(__dirname, "uploads")));

            // Parse user info from Gateway headers:
            server.use(parseUserHeaders);

            // Routes:
            server.use(vacationController.router);
            server.use(likeController.router);
            server.use(reportController.router);

            // Error handling:
            server.use(routeNotFound);
            server.use(errorMiddleware);

            server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
        }
        catch (err: unknown) {
            console.error(err);
        }
    }
}

const app = new App();
app.start();
