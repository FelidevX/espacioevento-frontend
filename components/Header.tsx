"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Building,
  Users,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = hasRole("administrador") || hasRole("admin");
  const isHomePage = pathname === "/";

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    router.push("/");
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Calendar className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold text-slate-800">
            Espacio Evento
          </span>
        </a>

        <div className="hidden md:flex gap-6 items-center">
          {isAuthenticated && (
            <a
              href="/eventos"
              className="text-slate-600 hover:text-blue-600 transition font-medium"
            >
              Eventos
            </a>
          )}
          {isAuthenticated && isAdmin && (
            <a
              href="/salas"
              className="text-slate-600 hover:text-blue-600 transition font-medium flex items-center gap-1"
            >
              <Building size={18} />
              Salas
            </a>
          )}
          {isHomePage && (
            <>
              <a
                href="#salas"
                className="text-slate-600 hover:text-blue-600 transition"
              >
                Salas Disponibles
              </a>
              <a
                href="#como-funciona"
                className="text-slate-600 hover:text-blue-600 transition"
              >
                Cómo Funciona
              </a>
            </>
          )}

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition"
              >
                <User className="text-blue-600" size={20} />
                <span className="text-slate-800 font-medium">
                  {user?.nombre} {user?.apellido}
                </span>
                <ChevronDown
                  className={`text-slate-600 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  size={18}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-800">
                      {user?.nombre} {user?.apellido}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.correo}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/perfil");
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition"
                  >
                    <Settings size={18} />
                    Mi Perfil
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push("/usuarios");
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition"
                      >
                        <Users size={18} />
                        Gestión de Usuarios
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          router.push("/inscripciones");
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-3 transition"
                      >
                        <ClipboardList size={18} />
                        Todas las Inscripciones
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition border-t border-slate-200 mt-2 pt-2"
                  >
                    <LogOut size={18} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition cursor-pointer"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
