// Enums y tipos compartidos
export enum RolUsuario {
  ASISTENTE = "asistente",
  ORGANIZADOR = "organizador",
  ADMINISTRADOR = "administrador",
}

export enum EstadoEvento {
  ACTIVO = "activo",
  FINALIZADO = "finalizado",
  CANCELADO = "cancelado",
}

export enum TipoEvento {
  PUBLICO = "público",
  PRIVADO = "privado",
}

// Interfaces de entidades
export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  roles: string[];
  fecha_registro: string;
}

export interface Evento {
  id_evento: number;
  id_organizador: number;
  id_sala: number;
  nombre_evento: string;
  descripcion: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  cupos_totales: number;
  cupos_disponibles: number;
  precio_entrada: number;
  tipo_evento: TipoEvento;
  estado: EstadoEvento;
}

export interface Sala {
  id_sala: number;
  nombre: string;
  ubicación: string;
  capacidad: number;
  precio_arriendo: number;
  estado: string;
}

export interface Inscripcion {
  id_inscripcion: number;
  id_usuario: number;
  id_evento: number;
  fecha_inscripcion: string;
  estado_pago: string;
  asistencia: boolean;
}

export interface Pago {
  id_pago: number;
  id_usuario: number;
  id_evento?: number;
  id_sala?: number;
  monto: number;
  tipo_pago: string;
  metodo: string;
  fecha_pago: string;
  estado: string;
}
