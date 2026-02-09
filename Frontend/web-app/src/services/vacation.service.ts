import api from "./api";
import type { VacationModel } from "../models/vacation.model";

class VacationService {

    async getAll(): Promise<VacationModel[]> {
        const response = await api.get("/api/vacations");
        return response.data.data;
    }

    async getById(id: number): Promise<VacationModel> {
        const response = await api.get(`/api/vacations/${id}`);
        return response.data.data;
    }

    async create(formData: FormData): Promise<VacationModel> {
        const response = await api.post("/api/vacations", formData);
        return response.data.data;
    }

    async update(id: number, formData: FormData): Promise<VacationModel> {
        const response = await api.put(`/api/vacations/${id}`, formData);
        return response.data.data;
    }

    async remove(id: number): Promise<void> {
        await api.delete(`/api/vacations/${id}`);
    }

    async like(vacationId: number): Promise<void> {
        await api.post(`/api/likes/${vacationId}`);
    }

    async unlike(vacationId: number): Promise<void> {
        await api.delete(`/api/likes/${vacationId}`);
    }
}

export const vacationService = new VacationService();
