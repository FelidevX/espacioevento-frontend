import { Evento } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  correo: string;
  password: string;
  nombre: string;
  apellido: string;
  roles?: string[];
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    correo: string;
    nombre: string;
    apellido: string;
    roles: string[];
  };
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  roles: string[];
  fecha_registro: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error en la petición");
      }

      // Si es 204 No Content, no intentar parsear JSON
      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error de conexión con el servidor");
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async checkAuthStatus(token: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/check-status", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Eventos
  async getEventos(token: string): Promise<Evento[]> {
    return this.request<Evento[]>("/eventos", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getEvento(id: number, token: string): Promise<Evento> {
    return this.request<Evento>(`/eventos/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createEvento(data: any, token: string): Promise<Evento> {
    return this.request<Evento>("/eventos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async updateEvento(id: number, data: any, token: string): Promise<Evento> {
    return this.request<Evento>(`/eventos/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async deleteEvento(id: number, token: string): Promise<void> {
    return this.request<void>(`/eventos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Inscripciones
  async getInscripciones(token: string): Promise<any[]> {
    return this.request<any[]>("/inscripciones", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createInscripcion(data: any, token: string): Promise<any> {
    return this.request<any>("/inscripciones", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async getInscripcionesByUsuario(
    idUsuario: number,
    token: string
  ): Promise<any[]> {
    return this.request<any[]>(`/inscripciones/usuario/${idUsuario}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getInscripcionesByEvento(
    idEvento: number,
    token: string
  ): Promise<any[]> {
    return this.request<any[]>(`/inscripciones/evento/${idEvento}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteInscripcion(id: number, token: string): Promise<void> {
    return this.request<void>(`/inscripciones/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateInscripcionEstadoPago(
    id: number,
    estadoPago: "pendiente" | "pagado",
    token: string
  ): Promise<any> {
    return this.request<any>(`/inscripciones/${id}/pago`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado_pago: estadoPago }),
    });
  }

  // Pagos
  async createMercadoPagoPreference(
    idInscripcion: number,
    token: string
  ): Promise<any> {
    return this.request<any>("/pagos/mercadopago/create-preference", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_inscripcion: idInscripcion }),
    });
  }

  // Salas
  async getSalas(token: string): Promise<any[]> {
    return this.request<any[]>("/salas", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getSala(id: number, token: string): Promise<any> {
    return this.request<any>(`/salas/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createSala(data: any, token: string): Promise<any> {
    return this.request<any>("/salas", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async updateSala(id: number, data: any, token: string): Promise<any> {
    return this.request<any>(`/salas/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async deleteSala(id: number, token: string): Promise<void> {
    return this.request<void>(`/salas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Usuarios
  async getUsuarios(token: string): Promise<Usuario[]> {
    return this.request<Usuario[]>("/usuarios", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUsuario(id: number, token: string): Promise<Usuario> {
    return this.request<Usuario>(`/usuarios/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();
