import { OkPacket } from "mysql2";
import { dal } from "../utils/dal";
import { ConflictError, NotFoundError } from "@yd/restify";

class LikeService {

    async like(userId: number, vacationId: number): Promise<void> {
        try {
            await dal.execute(
                "INSERT INTO likes (userId, vacationId) VALUES (?, ?)",
                [userId, vacationId]
            );
        } catch (err: unknown) {
            const mysqlError = err as { code?: string };
            if (mysqlError.code === "ER_DUP_ENTRY") {
                throw new ConflictError("You already liked this vacation.");
            }
            throw err;
        }
    }

    async unlike(userId: number, vacationId: number): Promise<void> {
        const result = await dal.execute(
            "DELETE FROM likes WHERE userId = ? AND vacationId = ?",
            [userId, vacationId]
        ) as OkPacket;

        if (result.affectedRows === 0) {
            throw new NotFoundError("Like not found.");
        }
    }
}

export const likeService = new LikeService();
