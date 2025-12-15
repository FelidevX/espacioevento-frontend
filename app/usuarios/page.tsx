"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Users, Mail, Shield, Calendar } from "lucide-react";
import { usuariosService } from "@/lib/services/usuarios.service";

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  roles: string[];
  fecha_registro: string;
}

export default function UsuariosPage() {
  const { token, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
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

    loadUsuarios();
  }, [isAuthenticated, isAdmin, token]);

  const loadUsuarios = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await usuariosService.getAll(token);
      setUsuarios(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
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
              <Users className="text-blue-600" size={32} />
              Gestión de Usuarios
            </h1>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : usuarios.length === 0 ? (
              <p className="text-slate-600 text-center py-12">No hay usuarios registrados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-4 px-4 text-slate-700 font-bold">ID</th>
                      <th className="text-left py-4 px-4 text-slate-700 font-bold">Nombre</th>
                      <th className="text-left py-4 px-4 text-slate-700 font-bold">Correo</th>
                      <th className="text-left py-4 px-4 text-slate-700 font-bold">Roles</th>
                      <th className="text-left py-4 px-4 text-slate-700 font-bold">Fecha Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id_usuario} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="py-4 px-4 text-slate-700 font-medium">#{usuario.id_usuario}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users size={16} className="text-blue-600" />
                            </div>
                            <span className="text-slate-900 font-semibold">
                              {usuario.nombre} {usuario.apellido}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail size={16} />
                            {usuario.correo}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2 flex-wrap">
                            {usuario.roles.map((role, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold capitalize flex items-center gap-1"
                              >
                                <Shield size={12} />
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar size={16} />
                            {new Date(usuario.fecha_registro).toLocaleDateString("es-CL", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Total de usuarios: <span className="font-bold text-slate-900">{usuarios.length}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
