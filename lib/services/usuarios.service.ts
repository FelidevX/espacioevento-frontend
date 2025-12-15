import { apiService } from "../api";
import { Usuario } from "../types";

class UsuariosService {
  async getAll(token: string): Promise<Usuario[]> {
    return apiService.getUsuarios(token);
  }

  async getById(id: number, token: string): Promise<Usuario> {
    return apiService.getUsuario(id, token);
  }
}

export const usuariosService = new UsuariosService();
