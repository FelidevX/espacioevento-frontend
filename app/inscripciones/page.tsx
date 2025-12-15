"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { ClipboardList, User, Calendar, CheckCircle, XCircle } from "lucide-react";
import { apiService } from "@/lib/api";
import { usuariosService } from "@/lib/services/usuarios.service";
import { eventosService } from "@/lib/services/eventos.service";

interface Inscripcion {
  id_inscripcion: number;
  id_usuario: number;
  id_evento: number;
  fecha_inscripcion: string;
  estado_pago: string;
  asistencia: boolean;
}

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
}

interface Evento {
  id_evento: number;
  nombre_evento: string;
}

export default function InscripcionesPage() {
  const { token, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [usuarios, setUsuarios] = useState<Record<number, Usuario>>({});
  const [eventos, setEventos] = useState<Record<number, Evento>>({});
  const [loading, setLoading] = useState(true);

  const isAdmin = hasRole("administrador") || hasRole("admin");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (!isAdmin) {
      router.push("/eventos");
      return;
    }

    loadData();
  }, [isAuthenticated, isAdmin, token]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Cargar inscripciones
      const inscripcionesData = await apiService.getInscripciones(token);
      setInscripciones(inscripcionesData);

      // Cargar todos los usuarios
      const usuariosData = await usuariosService.getAll(token);
      const usuariosMap: Record<number, Usuario> = {};
      usuariosData.forEach((u) => {
        usuariosMap[u.id_usuario] = u;
      });
      setUsuarios(usuariosMap);

      // Cargar todos los eventos
      const eventosData = await eventosService.getAll(token);
      const eventosMap: Record<number, Evento> = {};
      eventosData.forEach((e) => {
        eventosMap[e.id_evento] = e;
      });
      setEventos(eventosMap);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <ClipboardList className="text-blue-600" size={32} />
              Todas las Inscripciones
            </h1>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : inscripciones.length === 0 ? (
              <p className="text-slate-600 text-center py-12">No hay inscripciones registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-4 px-4 text-slate-700 font-bold">ID</th>
                      <th className="text-left py-4 px-4 text-slate-700 font-bold">Usuario</th>
                      <th className="text-left py-4 px-4 text-slate-700 font-bold">Evento</th>
                      <th className="text-left py-4 px-4 text-slate-700 font-bold">Fecha Inscripción</th>
                      <th className="text-left py-4 px-4 text-slate-700 font-bold">Estado Pago</th>
                      <th className="text-left py-4 px-4 text-slate-700 font-bold">Asistencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscripciones.map((inscripcion) => {
                      const usuario = usuarios[inscripcion.id_usuario];
                      const evento = eventos[inscripcion.id_evento];

                      return (
                        <tr key={inscripcion.id_inscripcion} className="border-b border-slate-100 hover:bg-slate-50 transition">
                          <td className="py-4 px-4 text-slate-700 font-medium">#{inscripcion.id_inscripcion}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <User size={16} className="text-purple-600" />
                              </div>
                              <div>
                                <p className="text-slate-900 font-semibold">
                                  {usuario ? `${usuario.nombre} ${usuario.apellido}` : `Usuario #${inscripcion.id_usuario}`}
                                </p>
                                {usuario && (
                                  <p className="text-xs text-slate-500">{usuario.correo}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="text-slate-900 font-medium">
                              {evento ? evento.nombre_evento : `Evento #${inscripcion.id_evento}`}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Calendar size={16} />
                              {new Date(inscripcion.fecha_inscripcion).toLocaleDateString("es-CL", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                inscripcion.estado_pago === "pagado"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {inscripcion.estado_pago === "pagado" ? (
                                <CheckCircle size={14} />
                              ) : (
                                <XCircle size={14} />
                              )}
                              {inscripcion.estado_pago}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                inscripcion.asistencia
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {inscripcion.asistencia ? (
                                <>
                                  <CheckCircle size={14} />
                                  Asistió
                                </>
                              ) : (
                                <>
                                  <XCircle size={14} />
                                  Pendiente
                                </>
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Total de inscripciones: <span className="font-bold text-slate-900">{inscripciones.length}</span>
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-600">
                    Pagadas: <span className="font-bold">{inscripciones.filter(i => i.estado_pago === "pagado").length}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-slate-600">
                    Pendientes: <span className="font-bold">{inscripciones.filter(i => i.estado_pago === "pendiente").length}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
