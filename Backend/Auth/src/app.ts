import { appConfig } from "./utils/app-config";
import express from "express";
import { authController } from "./controllers/auth.controller";
import { errorMiddleware, routeNotFound } from "@yd/restify";

class App {

    public start(): void {
        try {
            const server = express();
            server.use(express.json());
            server.use(authController.router);
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
