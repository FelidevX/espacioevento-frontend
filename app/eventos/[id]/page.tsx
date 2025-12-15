"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  MapPin,
  DollarSign,
  Edit,
  Trash2,
  UserPlus,
  CreditCard,
  Building,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { eventosService } from "@/lib/services/eventos.service";
import { inscripcionesService } from "@/lib/services/inscripciones.service";
import { salasService } from "@/lib/services/salas.service";
import { apiService } from "@/lib/api";
import { Evento, TipoEvento, Sala } from "@/lib/types";

export default function EventoDetallesPage() {
  const params = useParams();
  const router = useRouter();
  const { token, isAuthenticated, hasRole, user } = useAuth();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [sala, setSala] = useState<Sala | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inscribiendo, setInscribiendo] = useState(false);
  const [inscripcion, setInscripcion] = useState<any>(null);
  const [cantidadInscritos, setCantidadInscritos] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre_evento: "",
    descripcion: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    cupos_totales: 0,
    precio_entrada: 0,
    id_organizador: 0,
    id_sala: 0,
    tipo_evento: TipoEvento.PUBLICO,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    loadEvento();
  }, [isAuthenticated, params.id]);

  const loadEvento = async () => {
    try {
      if (token && params.id) {
        const data = await eventosService.getById(
          parseInt(params.id as string),
          token
        );
        setEvento(data);

        // Cargar información de la sala
        if (data.id_sala) {
          try {
            const salaData = await salasService.getById(data.id_sala, token);
            setSala(salaData);
          } catch (err) {
            console.error("Error cargando sala:", err);
          }
        }

        // Cargar cantidad de inscritos
        const inscritos = await inscripcionesService.getByEvento(
          data.id_evento,
          token
        );
        setCantidadInscritos(inscritos.length);

        // Verificar si el usuario actual está inscrito
        if (user) {
          const miInscripcion = inscritos.find(
            (i) => i.id_usuario === parseInt(user.id)
          );
          setInscripcion(miInscripcion || null);
        }
      }
    } catch (err) {
      setError("Error cargando el evento");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (token && params.id) {
        await eventosService.delete(parseInt(params.id as string), token);
        setShowDeleteModal(false);
        router.push("/eventos");
      }
    } catch (err) {
      console.error("Error eliminando evento:", err);
      alert("Error al eliminar el evento");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (token && params.id) {
        await eventosService.update(
          parseInt(params.id as string),
          editForm,
          token
        );
        setShowEditModal(false);
        await loadEvento();
        alert("Evento actualizado exitosamente");
      }
    } catch (err: any) {
      console.error("Error actualizando evento:", err);
      alert(err.message || "Error al actualizar el evento");
    }
  };

  const openEditModal = () => {
    if (evento) {
      setEditForm({
        nombre_evento: evento.nombre_evento,
        descripcion: evento.descripcion || "",
        fecha: evento.fecha,
        hora_inicio: evento.hora_inicio,
        hora_fin: evento.hora_fin,
        cupos_totales: evento.cupos_totales,
        precio_entrada: evento.precio_entrada,
        id_organizador: evento.id_organizador,
        id_sala: evento.id_sala,
        tipo_evento: evento.tipo_evento,
      });
      setShowEditModal(true);
    }
  };

  const handleInscripcion = async () => {
    if (!user || !token || !evento) return;

    setInscribiendo(true);
    try {
      await inscripcionesService.create(
        {
          id_evento: evento.id_evento,
          id_usuario: parseInt(user.id),
          estado_pago: evento.precio_entrada === 0 ? "pagado" : "pendiente",
        },
        token
      );

      alert("¡Inscripción exitosa! Te has registrado al evento.");
      // Redirigir a la página de eventos
      router.push("/eventos");
    } catch (err: any) {
      console.error("Error en inscripción:", err);
      const message = err.message || "Error al inscribirse al evento";
      alert(message);
    } finally {
      setInscribiendo(false);
    }
  };

  const handleDesinscripcion = async () => {
    if (!user || !token || !inscripcion) return;

    if (!confirm("¿Estás seguro de cancelar tu inscripción a este evento?"))
      return;

    setInscribiendo(true);
    try {
      await inscripcionesService.delete(inscripcion.id_inscripcion, token);

      alert("Te has desinscrito del evento exitosamente.");
      // Redirigir a la página de eventos
      router.push("/eventos");
    } catch (err: any) {
      console.error("Error en desinscripción:", err);
      const message = err.message || "Error al desinscribirse del evento";
      alert(message);
    } finally {
      setInscribiendo(false);
    }
  };

  const handlePagar = async () => {
    if (!inscripcion || !token) return;

    setInscribiendo(true);
    try {
      console.log(
        "Iniciando pago para inscripción:",
        inscripcion.id_inscripcion
      );
      const response = await apiService.createMercadoPagoPreference(
        inscripcion.id_inscripcion,
        token
      );
      console.log("Respuesta de Mercado Pago:", response);

      // Abrir checkout de Mercado Pago en nueva ventana
      if (response.sandbox_init_point) {
        window.open(response.sandbox_init_point, "_blank");

        // Actualizar estado después de 3 segundos (simulado)
        setTimeout(async () => {
          try {
            // Actualizar estado en la base de datos
            await inscripcionesService.updateEstadoPago(
              inscripcion.id_inscripcion,
              "pagado",
              token
            );

            // Actualizar estado local con nuevo objeto
            const inscripcionActualizada = {
              ...inscripcion,
              estado_pago: "pagado" as const,
            };
            setInscripcion(inscripcionActualizada);
            alert("¡Pago realizado exitosamente!");
            await loadEvento();
          } catch (error) {
            console.error("Error actualizando estado de pago:", error);
            alert(
              "El pago se procesó pero hubo un error al actualizar el estado"
            );
          }
        }, 3000);
      } else {
        throw new Error("No se recibió el link de pago");
      }
    } catch (err: any) {
      console.error("Error completo al procesar pago:", err);
      const errorMessage = err.message || "Error al procesar el pago";
      alert("Error al crear preferencia de pago: " + errorMessage);
    } finally {
      setInscribiendo(false);
    }
  };

  const isOwnerOrAdmin =
    evento &&
    user &&
    (evento.id_organizador === parseInt(user.id) ||
      hasRole("administrador") ||
      hasRole("admin"));

  const isAsistente = hasRole("asistente");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-semibold">
                {error || "Evento no encontrado"}
              </p>
              <button
                onClick={() => router.push("/eventos")}
                className="mt-4 text-blue-600 hover:underline"
              >
                Volver a eventos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Botón volver */}
          <button
            onClick={() => router.push("/eventos")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition"
          >
            <ArrowLeft size={20} />
            Volver a eventos
          </button>

          {/* Header del evento */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-xl p-8 text-white relative">
            <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full text-blue-600 font-bold text-lg">
              ${evento.precio_entrada.toLocaleString()}
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">
                  {evento.nombre_evento}
                </h1>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    evento.estado === "activo"
                      ? "bg-green-500 text-white"
                      : evento.estado === "finalizado"
                      ? "bg-gray-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {evento.estado.toUpperCase()}
                </span>
                <span
                  className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    evento.tipo_evento === "público"
                      ? "bg-blue-500 text-white"
                      : "bg-purple-500 text-white"
                  }`}
                >
                  {evento.tipo_evento}
                </span>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="bg-white rounded-b-xl shadow-lg p-8">
            {/* Descripción */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Descripción
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                {evento.descripcion || "Sin descripción disponible"}
              </p>
            </div>

            {/* Información del evento */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <Calendar className="text-blue-600 mt-1" size={24} />
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Fecha</p>
                  <p className="text-lg text-slate-900 font-medium">
                    {new Date(evento.fecha).toLocaleDateString("es-CL", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <Clock className="text-blue-600 mt-1" size={24} />
                <div>
                  <p className="text-sm text-slate-500 font-semibold">
                    Horario
                  </p>
                  <p className="text-lg text-slate-900 font-medium">
                    {evento.hora_inicio} - {evento.hora_fin}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <Users className="text-blue-600 mt-1" size={24} />
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Cupos</p>
                  <p className="text-lg text-slate-900 font-medium">
                    {evento.cupos_disponibles} disponibles de{" "}
                    {evento.cupos_totales}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {cantidadInscritos}{" "}
                    {cantidadInscritos === 1
                      ? "persona inscrita"
                      : "personas inscritas"}
                  </p>
                  <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (cantidadInscritos / evento.cupos_totales) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <DollarSign className="text-blue-600 mt-1" size={24} />
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Precio</p>
                  <p className="text-lg text-slate-900 font-medium">
                    ${evento.precio_entrada.toLocaleString()}
                    {evento.precio_entrada === 0 && " (Gratis)"}
                  </p>
                </div>
              </div>

              {sala && (
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg col-span-full">
                  <Building className="text-blue-600 mt-1" size={24} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 font-semibold mb-2">
                      Sala
                    </p>
                    <p className="text-lg text-slate-900 font-bold">
                      {sala.nombre}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <MapPin size={16} />
                        {sala.ubicación}
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Users size={16} />
                        Capacidad: {sala.capacidad} personas
                      </p>
                      <p className="text-sm text-slate-600">
                        Estado:{" "}
                        <span
                          className={`font-semibold ${
                            sala.estado === "disponible"
                              ? "text-green-600"
                              : sala.estado === "arrendada"
                              ? "text-orange-600"
                              : "text-gray-600"
                          }`}
                        >
                          {sala.estado}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              {isOwnerOrAdmin ? (
                <>
                  <button
                    onClick={openEditModal}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Edit size={20} />
                    Editar Evento
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                  >
                    <Trash2 size={20} />
                    Eliminar
                  </button>
                </>
              ) : isAsistente ? (
                inscripcion ? (
                  <div className="flex gap-4 flex-1">
                    {inscripcion.estado_pago === "pendiente" &&
                      evento.precio_entrada > 0 && (
                        <button
                          onClick={handlePagar}
                          disabled={inscribiendo}
                          className={`flex-1 ${
                            inscribiendo
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          } text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition`}
                        >
                          <CreditCard size={20} />
                          {inscribiendo
                            ? "Procesando..."
                            : "Pagar con Mercado Pago"}
                        </button>
                      )}
                    <button
                      onClick={handleDesinscripcion}
                      disabled={inscribiendo}
                      className={`${
                        inscripcion.estado_pago === "pendiente"
                          ? "flex-shrink-0"
                          : "flex-1"
                      } ${
                        inscribiendo
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-700"
                      } text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition`}
                    >
                      <UserPlus size={20} />
                      {inscribiendo ? "Procesando..." : "Desinscribirse"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleInscripcion}
                    disabled={
                      inscribiendo ||
                      evento.cupos_disponibles === 0 ||
                      evento.estado !== "activo"
                    }
                    className={`flex-1 ${
                      inscribiendo ||
                      evento.cupos_disponibles === 0 ||
                      evento.estado !== "activo"
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition`}
                  >
                    <UserPlus size={20} />
                    {inscribiendo
                      ? "Inscribiendo..."
                      : evento.cupos_disponibles === 0
                      ? "Sin Cupos"
                      : evento.estado !== "activo"
                      ? "Evento Finalizado"
                      : "Inscribirse al Evento"}
                  </button>
                )
              ) : (
                <div className="flex-1 bg-slate-100 text-slate-600 px-6 py-3 rounded-lg font-semibold text-center">
                  Evento de otro organizador
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Eliminar Evento
            </h3>

            <p className="text-slate-600 mb-6">
              ¿Estás seguro de que deseas eliminar el evento{" "}
              <strong>{evento?.nombre_evento}</strong>? Esta acción no se puede
              deshacer.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de evento */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Editar Evento
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nombre del Evento
                </label>
                <input
                  type="text"
                  value={editForm.nombre_evento}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nombre_evento: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={editForm.descripcion}
                  onChange={(e) =>
                    setEditForm({ ...editForm, descripcion: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={editForm.fecha}
                    onChange={(e) =>
                      setEditForm({ ...editForm, fecha: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Cupos Totales
                  </label>
                  <input
                    type="number"
                    value={editForm.cupos_totales}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        cupos_totales: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={editForm.hora_inicio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, hora_inicio: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={editForm.hora_fin}
                    onChange={(e) =>
                      setEditForm({ ...editForm, hora_fin: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Precio de Entrada ($)
                </label>
                <input
                  type="number"
                  value={editForm.precio_entrada}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      precio_entrada: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
