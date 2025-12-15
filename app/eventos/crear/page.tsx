"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  DollarSign,
  FileText,
  Home,
} from "lucide-react";
import { eventosService } from "@/lib/services/eventos.service";
import { TipoEvento, EstadoEvento } from "@/lib/types";

export default function CrearEventoPage() {
  const { token, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nombre_evento: "",
    descripcion: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    cupos_totales: "",
    precio_entrada: "",
    tipo_evento: "público",
    id_sala: "1", // Por ahora hardcodeado, después lo haremos dinámico
  });

  useEffect(() => {
    console.log("Auth check - isAuthenticated:", isAuthenticated);
    console.log("User roles:", hasRole);

    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    const isOrganizer = hasRole("organizador") || hasRole("organizer");
    const isAdmin = hasRole("administrador") || hasRole("admin");

    console.log("isOrganizer:", isOrganizer, "isAdmin:", isAdmin);

    if (!isOrganizer && !isAdmin) {
      console.log("Access denied - redirecting to /eventos");
      router.push("/eventos");
    }
  }, [isAuthenticated, hasRole, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!token) throw new Error("No token found");

      // Obtener el id del usuario del localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("Usuario no encontrado");
      const user = JSON.parse(userStr);

      const eventoData = {
        ...formData,
        id_organizador: parseInt(user.id),
        id_sala: parseInt(formData.id_sala),
        cupos_totales: parseInt(formData.cupos_totales),
        precio_entrada: parseFloat(formData.precio_entrada),
        tipo_evento: formData.tipo_evento as TipoEvento,
        estado: EstadoEvento.ACTIVO,
      };

      console.log("Enviando evento:", eventoData);
      await eventosService.create(eventoData, token);
      router.push("/eventos");
    } catch (err) {
      console.error("Error creando evento:", err);
      setError(err instanceof Error ? err.message : "Error al crear el evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
          >
            <ArrowLeft size={20} />
            Volver
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Crear Nuevo Evento
            </h1>
            <p className="text-slate-600 mb-8">
              Completa la información de tu evento
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del Evento *
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="nombre_evento"
                    value={formData.nombre_evento}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Ej: Concierto de Rock 2025"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descripción *
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-3 top-3 text-slate-400"
                    size={20}
                  />
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Describe tu evento..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Evento *
                  </label>
                  <select
                    name="tipo_evento"
                    value={formData.tipo_evento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="público">Público</option>
                    <option value="privado">Privado</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hora Inicio *
                  </label>
                  <div className="relative">
                    <Clock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="time"
                      name="hora_inicio"
                      value={formData.hora_inicio}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hora Fin *
                  </label>
                  <div className="relative">
                    <Clock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="time"
                      name="hora_fin"
                      value={formData.hora_fin}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cupos Totales *
                  </label>
                  <div className="relative">
                    <Users
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="number"
                      name="cupos_totales"
                      value={formData.cupos_totales}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Precio Entrada *
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="number"
                      name="precio_entrada"
                      value={formData.precio_entrada}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="15000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition shadow-lg shadow-blue-600/30"
                >
                  {loading ? "Creando..." : "Crear Evento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
