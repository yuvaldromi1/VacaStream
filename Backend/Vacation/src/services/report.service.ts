import { dal } from "../utils/dal";
import { stringify } from "csv-stringify/sync";

interface ReportRow {
    destination: string;
    likesCount: number;
}

class ReportService {

    async getLikesReport(): Promise<ReportRow[]> {
        const rows = await dal.execute(
            `SELECT v.destination, COUNT(l.userId) AS likesCount
             FROM vacations v
             LEFT JOIN likes l ON v.id = l.vacationId
             GROUP BY v.id, v.destination
             ORDER BY likesCount DESC`
        ) as ReportRow[];

        // Convert MySQL BIGINT to proper JavaScript number:
        rows.forEach(row => {
            row.likesCount = Number(row.likesCount);
        });

        return rows;
    }

    async getCsv(): Promise<string> {
        const rows = await this.getLikesReport();
        const csv = stringify(rows, {
            header: true,
            columns: [
                { key: "destination", header: "Destination" },
                { key: "likesCount", header: "Likes" }
            ]
        });
        return csv;
    }
}

export const reportService = new ReportService();
