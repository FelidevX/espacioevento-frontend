import { apiService } from "../api";
import { Evento } from "../types";

export class EventosService {
  async getAll(token: string): Promise<Evento[]> {
    return apiService.getEventos(token);
  }

  async getById(id: number, token: string): Promise<Evento> {
    return apiService.getEvento(id, token);
  }

  async create(data: Partial<Evento>, token: string): Promise<Evento> {
    return apiService.createEvento(data, token);
  }

  async update(
    id: number,
    data: Partial<Evento>,
    token: string
  ): Promise<Evento> {
    return apiService.updateEvento(id, data, token);
  }

  async delete(id: number, token: string): Promise<void> {
    return apiService.deleteEvento(id, token);
  }
}

export const eventosService = new EventosService();
