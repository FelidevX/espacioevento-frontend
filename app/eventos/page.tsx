"use client";
import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Clock, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { eventosService } from "@/lib/services/eventos.service";
import { inscripcionesService } from "@/lib/services/inscripciones.service";
import { Evento } from "@/lib/types";

type TabType = "todos" | "inscritos";

export default function EventosPage() {
  const {
    token,
    isAuthenticated,
    hasRole,
    user,
    loading: authLoading,
  } = useAuth();
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosInscritos, setEventosInscritos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("todos");

  useEffect(() => {
    // Esperar a que termine de cargar el auth
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    // Limpiar estado al montar/cambiar usuario
    setEventos([]);
    setEventosInscritos([]);
    setLoading(true);

    loadEventos();
  }, [authLoading, isAuthenticated, user?.id, router]);

  const loadEventos = async () => {
    try {
      if (token) {
        const data = await eventosService.getAll(token);
        setEventos(data);

        // Cargar eventos inscritos después de cargar todos los eventos
        if (hasRole("asistente") && user) {
          await loadEventosInscritosFromList(data);
        }
      }
    } catch (error) {
      console.error("Error cargando eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEventosInscritosFromList = async (todosEventos: Evento[]) => {
    try {
      if (token && user) {
        const inscripciones = await inscripcionesService.getByUsuario(
          parseInt(user.id),
          token
        );
        const idsEventosInscritos = inscripciones.map((i) => i.id_evento);

        // Filtrar eventos inscritos de la lista completa
        const eventosInscritosData = todosEventos.filter((e) =>
          idsEventosInscritos.includes(e.id_evento)
        );
        setEventosInscritos(eventosInscritosData);
      }
    } catch (error) {
      console.error("Error cargando eventos inscritos:", error);
    }
  };

  const loadEventosInscritos = async () => {
    await loadEventosInscritosFromList(eventos);
  };

  const isOrganizer =
    hasRole("organizador") ||
    hasRole("organizer") ||
    hasRole("administrador") ||
    hasRole("admin");
  const isAsistente = hasRole("asistente");

  // Para organizadores: filtrar eventos propios
  const misEventos =
    isOrganizer && user
      ? eventos.filter((e) => e.id_organizador === parseInt(user.id))
      : [];

  const eventosDeOtros =
    isOrganizer && user
      ? eventos.filter((e) => e.id_organizador !== parseInt(user.id))
      : [];

  // Filtrar eventos para asistentes: en "todos" no mostrar los que ya está inscrito
  const eventosDisponibles = isAsistente
    ? eventos.filter(
        (e) => !eventosInscritos.some((ei) => ei.id_evento === e.id_evento)
      )
    : eventos;

  const eventosToShow = isAsistente
    ? activeTab === "todos"
      ? eventosDisponibles
      : eventosInscritos
    : isOrganizer
    ? activeTab === "todos"
      ? eventosDeOtros
      : misEventos
    : eventos;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {authLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-slate-600 mt-4">
                Verificando autenticación...
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    Eventos
                  </h1>
                  <p className="text-slate-600">
                    Descubre y únete a eventos increíbles
                  </p>
                </div>

                {isOrganizer && (
                  <button
                    onClick={() => router.push("/eventos/crear")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-lg shadow-blue-600/30"
                  >
                    <Plus size={20} />
                    Crear Evento
                  </button>
                )}
              </div>

              {/* Tabs para Asistentes */}
              {isAsistente && (
                <div className="flex gap-2 mb-6 border-b border-slate-200">
                  <button
                    onClick={() => setActiveTab("todos")}
                    className={`px-6 py-3 font-semibold transition ${
                      activeTab === "todos"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Todos los Eventos ({eventosDisponibles.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("inscritos")}
                    className={`px-6 py-3 font-semibold transition ${
                      activeTab === "inscritos"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Mis Inscripciones ({eventosInscritos.length})
                  </button>
                </div>
              )}

              {/* Tabs para Organizadores */}
              {isOrganizer && !isAsistente && (
                <div className="flex gap-2 mb-6 border-b border-slate-200">
                  <button
                    onClick={() => setActiveTab("inscritos")}
                    className={`px-6 py-3 font-semibold transition ${
                      activeTab === "inscritos"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Mis Eventos ({misEventos.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("todos")}
                    className={`px-6 py-3 font-semibold transition ${
                      activeTab === "todos"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Todos los Eventos ({eventosDeOtros.length})
                  </button>
                </div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : eventosToShow.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <Calendar className="mx-auto text-slate-300 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    {activeTab === "inscritos"
                      ? "No tienes inscripciones"
                      : "No hay eventos disponibles"}
                  </h3>
                  <p className="text-slate-500">
                    {activeTab === "inscritos"
                      ? "Inscríbete a eventos para verlos aquí"
                      : isOrganizer
                      ? "Crea tu primer evento para comenzar"
                      : "Vuelve pronto para ver nuevos eventos"}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventosToShow.map((evento) => (
                    <div
                      key={evento.id_evento}
                      onClick={() =>
                        router.push(`/eventos/${evento.id_evento}`)
                      }
                      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden group relative"
                    >
                      {/* Barra de color lateral */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-2 ${
                          evento.tipo_evento === "público"
                            ? "bg-gradient-to-b from-purple-500 to-purple-600"
                            : "bg-gradient-to-b from-blue-500 to-blue-600"
                        }`}
                      />

                      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-between">
                        <div className="flex-1" />
                        <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600 shadow-sm">
                          ${evento.precio_entrada.toLocaleString()}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                            {evento.nombre_evento}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              evento.estado === "activo"
                                ? "bg-green-100 text-green-700"
                                : evento.estado === "finalizado"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {evento.estado}
                          </span>
                        </div>

                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                          {evento.descripcion}
                        </p>

                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-blue-600" />
                            <span>
                              {new Date(evento.fecha).toLocaleDateString(
                                "es-CL"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-blue-600" />
                            <span>
                              {evento.hora_inicio} - {evento.hora_fin}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-blue-600" />
                            <span>
                              {Number(evento.cupos_totales) -
                                Number(evento.cupos_disponibles)}{" "}
                              inscritos / {Number(evento.cupos_totales)} cupos
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
