import { OkPacket } from "mysql2";
import { dal } from "../utils/dal";
import { deleteImage } from "../utils/image-helpers";
import { NotFoundError, ValidationError } from "@yd/restify";
import { VacationModel, VacationWithLikes } from "../models/vacation.model";

class VacationService {

    async getAll(userId: number): Promise<VacationWithLikes[]> {
        const vacations = await dal.execute(
            `SELECT v.*,
                    COUNT(l.userId) AS likesCount,
                    EXISTS(SELECT 1 FROM likes WHERE userId = ? AND vacationId = v.id) AS isLikedByUser
             FROM vacations v
             LEFT JOIN likes l ON v.id = l.vacationId
             GROUP BY v.id
             ORDER BY v.startDate ASC`,
            [userId]
        ) as VacationWithLikes[];

        // Convert MySQL 0/1 to proper types:
        vacations.forEach(v => {
            v.isLikedByUser = Boolean(v.isLikedByUser);
            v.likesCount = Number(v.likesCount);
        });

        return vacations;
    }

    async getById(vacationId: number): Promise<VacationModel> {
        const vacations = await dal.execute(
            "SELECT * FROM vacations WHERE id = ?",
            [vacationId]
        ) as VacationModel[];

        if (vacations.length === 0) {
            throw new NotFoundError("Vacation not found.");
        }

        return vacations[0];
    }

    async create(vacation: VacationModel): Promise<VacationModel> {
        this.validate(vacation);

        // No past dates for new vacations:
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(vacation.startDate) < today) {
            throw new ValidationError("Start date cannot be in the past.");
        }

        const result = await dal.execute(
            "INSERT INTO vacations (destination, description, startDate, endDate, price, imageFileName) VALUES (?, ?, ?, ?, ?, ?)",
            [vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price, vacation.imageFileName]
        ) as OkPacket;

        vacation.id = result.insertId;
        return vacation;
    }

    async update(vacation: VacationModel): Promise<VacationModel> {
        const existing = await this.getById(vacation.id!);

        // If no new image provided, keep existing:
        if (!vacation.imageFileName) {
            vacation.imageFileName = existing.imageFileName;
        } else if (vacation.imageFileName !== existing.imageFileName) {
            // New image uploaded — delete old one:
            deleteImage(existing.imageFileName);
        }

        this.validate(vacation);

        await dal.execute(
            "UPDATE vacations SET destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, imageFileName = ? WHERE id = ?",
            [vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price, vacation.imageFileName, vacation.id!]
        );

        return vacation;
    }

    async delete(vacationId: number): Promise<void> {
        const vacation = await this.getById(vacationId);
        deleteImage(vacation.imageFileName);
        await dal.execute("DELETE FROM vacations WHERE id = ?", [vacationId]);
    }

    private validate(vacation: VacationModel): void {
        if (!vacation.destination || !vacation.description || !vacation.startDate || !vacation.endDate || vacation.price === undefined || !vacation.imageFileName) {
            throw new ValidationError("All fields are required.");
        }
        if (vacation.price < 0 || vacation.price > 10000) {
            throw new ValidationError("Price must be between 0 and 10,000.");
        }
        if (new Date(vacation.endDate) <= new Date(vacation.startDate)) {
            throw new ValidationError("End date must be after start date.");
        }
    }
}

export const vacationService = new VacationService();
