"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { User, Mail, Calendar, Shield } from "lucide-react";

export default function PerfilPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Perfil del usuario */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <User className="text-blue-600" size={32} />
              Mi Perfil
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <User className="text-blue-600 mt-1" size={24} />
                <div>
                  <p className="text-sm text-slate-500 font-semibold">
                    Nombre Completo
                  </p>
                  <p className="text-lg text-slate-900 font-medium">
                    {user.nombre} {user.apellido}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <Mail className="text-blue-600 mt-1" size={24} />
                <div>
                  <p className="text-sm text-slate-500 font-semibold">
                    Correo Electrónico
                  </p>
                  <p className="text-lg text-slate-900 font-medium">
                    {user.correo}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <Shield className="text-blue-600 mt-1" size={24} />
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Roles</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {user.roles.map((role, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <Calendar className="text-blue-600 mt-1" size={24} />
                <div>
                  <p className="text-sm text-slate-500 font-semibold">
                    ID de Usuario
                  </p>
                  <p className="text-lg text-slate-900 font-medium">
                    #{user.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
