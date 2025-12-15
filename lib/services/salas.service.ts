import { apiService } from '../api';
import { Sala } from '../types';

class SalasService {
  async getAll(token: string): Promise<Sala[]> {
    return apiService.getSalas(token);
  }

  async getById(id: number, token: string): Promise<Sala> {
    return apiService.getSala(id, token);
  }

  async create(data: Omit<Sala, 'id_sala'>, token: string): Promise<Sala> {
    return apiService.createSala(data, token);
  }

  async update(id: number, data: Partial<Sala>, token: string): Promise<Sala> {
    return apiService.updateSala(id, data, token);
  }

  async delete(id: number, token: string): Promise<void> {
    return apiService.deleteSala(id, token);
  }
}

export const salasService = new SalasService();
