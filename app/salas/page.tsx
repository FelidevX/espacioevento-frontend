"use client";
import React, { useEffect, useState } from "react";
import {
  Building,
  MapPin,
  Users,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { salasService } from "@/lib/services/salas.service";
import { Sala } from "@/lib/types";

export default function SalasPage() {
  const { token, isAuthenticated, hasRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [salaToDelete, setSalaToDelete] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    ubicación: "",
    capacidad: 0,
    precio_arriendo: 0,
    estado: "disponible",
  });

  const isAdmin = hasRole("administrador") || hasRole("admin");

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (!isAdmin) {
      router.push("/eventos");
      return;
    }

    loadSalas();
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const loadSalas = async () => {
    try {
      if (token) {
        const data = await salasService.getAll(token);
        setSalas(data);
      }
    } catch (error) {
      console.error("Error cargando salas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (sala?: Sala) => {
    if (sala) {
      setEditingId(sala.id_sala);
      setFormData({
        nombre: sala.nombre,
        ubicación: sala.ubicación,
        capacidad: sala.capacidad,
        precio_arriendo: sala.precio_arriendo,
        estado: sala.estado || "disponible",
      });
    } else {
      setEditingId(null);
      setFormData({
        nombre: "",
        ubicación: "",
        capacidad: 0,
        precio_arriendo: 0,
        estado: "disponible",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nombre: "",
      ubicación: "",
      capacidad: 0,
      precio_arriendo: 0,
      estado: "disponible",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (token) {
        if (editingId) {
          await salasService.update(editingId, formData, token);
          alert("Sala actualizada exitosamente");
        } else {
          await salasService.create(formData, token);
          alert("Sala creada exitosamente");
        }
        handleCloseModal();
        await loadSalas();
      }
    } catch (err: any) {
      console.error("Error guardando sala:", err);
      alert(err.message || "Error al guardar la sala");
    }
  };

  const handleDeleteClick = (id: number) => {
    setSalaToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (salaToDelete && token) {
      try {
        await salasService.delete(salaToDelete, token);
        setShowDeleteModal(false);
        setSalaToDelete(null);
        await loadSalas();
        alert("Sala eliminada exitosamente");
      } catch (err: any) {
        console.error("Error eliminando sala:", err);
        alert(err.message || "Error al eliminar la sala");
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Gestión de Salas
              </h1>
              <p className="text-slate-600">
                Administra las salas disponibles para eventos
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-md"
            >
              <Plus size={20} />
              Nueva Sala
            </button>
          </div>

          {salas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Building className="mx-auto text-slate-300 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No hay salas registradas
              </h3>
              <p className="text-slate-500">
                Crea tu primera sala para comenzar
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salas.map((sala) => (
                <div
                  key={sala.id_sala}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Building className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">
                          {sala.nombre}
                        </h3>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedSala(sala);
                          setShowDetailModal(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenModal(sala)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(sala.id_sala)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin size={18} className="text-slate-400" />
                      <span className="text-sm">{sala.ubicación}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users size={18} className="text-slate-400" />
                      <span className="text-sm">
                        Capacidad: {sala.capacidad} personas
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign size={18} className="text-slate-400" />
                      <span className="text-sm font-semibold text-blue-600">
                        ${sala.precio_arriendo.toLocaleString()} / evento
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de crear/editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              {editingId ? "Editar Sala" : "Nueva Sala"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nombre de la Sala
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formData.ubicación}
                  onChange={(e) =>
                    setFormData({ ...formData, ubicación: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Capacidad (personas)
                </label>
                <input
                  type="number"
                  value={formData.capacidad}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacidad: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-600"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Precio de Arriendo ($)
                </label>
                <input
                  type="number"
                  value={formData.precio_arriendo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      precio_arriendo: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-600"
                  min="0"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  {editingId ? "Guardar Cambios" : "Crear Sala"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Eliminar Sala
            </h3>
            <p className="text-slate-600 mb-6">
              ¿Estás seguro de que deseas eliminar esta sala? Esta acción no se
              puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSalaToDelete(null);
                }}
                className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalle de sala */}
      {showDetailModal && selectedSala && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-3xl font-bold text-slate-900">
                {selectedSala.nombre}
              </h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedSala(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <Building className="text-blue-600 mt-1" size={28} />
                <div className="flex-1">
                  <p className="text-sm text-slate-600 font-semibold mb-1">
                    Información General
                  </p>
                  <p className="text-lg text-slate-900 font-medium">
                    ID: #{selectedSala.id_sala}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <MapPin className="text-blue-600 mt-1" size={24} />
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">
                      Ubicación
                    </p>
                    <p className="text-lg text-slate-900 font-medium">
                      {selectedSala.ubicación}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <Users className="text-blue-600 mt-1" size={24} />
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">
                      Capacidad
                    </p>
                    <p className="text-lg text-slate-900 font-medium">
                      {selectedSala.capacidad} personas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <DollarSign className="text-blue-600 mt-1" size={24} />
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">
                      Precio por Evento
                    </p>
                    <p className="text-lg text-blue-600 font-bold">
                      ${selectedSala.precio_arriendo.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <Building className="text-blue-600 mt-1" size={24} />
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">
                      Estado
                    </p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                        selectedSala.estado === "disponible"
                          ? "bg-green-100 text-green-700"
                          : selectedSala.estado === "arrendada"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selectedSala.estado}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedSala(null);
                  }}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
