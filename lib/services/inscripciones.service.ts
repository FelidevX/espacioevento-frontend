import { apiService } from "../api";

export interface CreateInscripcionDto {
  id_evento: number;
  id_usuario: number;
  estado_pago?: "pendiente" | "pagado";
  asistencia?: boolean;
}

export interface Inscripcion {
  id_inscripcion: number;
  id_evento: number;
  id_usuario: number;
  estado_pago: "pendiente" | "pagado";
  asistencia: boolean;
  fecha_inscripcion: string;
}

export class InscripcionesService {
  async create(
    data: CreateInscripcionDto,
    token: string
  ): Promise<Inscripcion> {
    return apiService.createInscripcion(data, token);
  }

  async getByUsuario(idUsuario: number, token: string): Promise<Inscripcion[]> {
    return apiService.getInscripcionesByUsuario(idUsuario, token);
  }

  async getByEvento(idEvento: number, token: string): Promise<Inscripcion[]> {
    return apiService.getInscripcionesByEvento(idEvento, token);
  }

  async delete(id: number, token: string): Promise<void> {
    return apiService.deleteInscripcion(id, token);
  }
}

export const inscripcionesService = new InscripcionesService();
