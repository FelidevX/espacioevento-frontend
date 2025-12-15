"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Calendar,
  CreditCard,
  Shield,
  TrendingUp,
  ArrowRight,
  Check,
  Clock,
  House,
  Building,
} from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { salasService } from "@/lib/services/salas.service";
import { Sala } from "@/lib/types";

export default function Home() {
  const { token, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<"organizador" | "asistente">(
    "organizador"
  );
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loadingSalas, setLoadingSalas] = useState(true);

  const isOrganizerOrAdmin =
    hasRole("organizador") ||
    hasRole("organizer") ||
    hasRole("administrador") ||
    hasRole("admin");

  useEffect(() => {
    loadSalas();
  }, [token]);

  const loadSalas = async () => {
    try {
      if (token) {
        const data = await salasService.getAll(token);
        setSalas(data.filter((sala) => sala.estado === "disponible"));
      }
    } catch (err) {
      console.error("Error cargando salas:", err);
    } finally {
      setLoadingSalas(false);
    }
  };

  const beneficios = {
    organizador: [
      {
        icon: Calendar,
        title: "Gestiona tus Eventos",
        desc: "Crea y administra eventos de forma centralizada",
      },
      {
        icon: Users,
        title: "Control de Asistentes",
        desc: "Monitorea inscripciones y cupos en tiempo real",
      },
      {
        icon: Clock,
        title: "Gestión sin estrés",
        desc: "Automatiza tareas y ahorra tiempo en la organización",
      },
      {
        icon: TrendingUp,
        title: "Reportes y Analytics",
        desc: "Visualiza estadísticas de tus eventos",
      },
    ],
    asistente: [
      {
        icon: Calendar,
        title: "Inscripción Rápida",
        desc: "Regístrate en eventos con un solo clic",
      },
      {
        icon: Shield,
        title: "Privacidad Garantizada",
        desc: "Tus datos protegidos y acceso seguro",
      },
      {
        icon: Check,
        title: "Confirmación Automática",
        desc: "Recibe tu ticket por correo electrónico",
      },
      {
        icon: Clock,
        title: "Historial Completo",
        desc: "Accede a tus eventos pasados y futuros",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                🎉 Plataforma de Gestión de Eventos
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Organiza eventos de forma{" "}
                <span className="text-blue-600">profesional</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Sistema completo de gestión de eventos con control de
                asistentes, pagos integrados y arriendo de salas. Todo en un
                solo lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => (window.location.href = "/auth")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Crear Cuenta Gratis
                  <ArrowRight size={20} />
                </button>
              </div>
              <div className="mt-8 flex items-center gap-8 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" size={20} />
                  <span>Sin costo inicial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" size={20} />
                  <span>Comodidad total en la gestión</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop"
                  alt="Gestión de eventos"
                  className="rounded-lg w-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">2,847</p>
                    <p className="text-sm text-slate-600">Eventos creados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section id="como-funciona" className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-800">
            ¿Cómo funciona?
          </h2>
          <p className="text-center text-slate-600 mb-12 text-lg">
            Diseñado para organizadores y asistentes
          </p>

          {/* Tab Selector */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab("organizador")}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                activeTab === "organizador"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              Soy Organizador
            </button>
            <button
              onClick={() => setActiveTab("asistente")}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                activeTab === "asistente"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              Soy Asistente
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios[activeTab].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salas Section */}
      <section id="salas" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Salas Disponibles
            </h2>
            <p className="text-slate-600 text-lg">
              Espacios equipados para todo tipo de eventos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loadingSalas ? (
              <div className="col-span-3 text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : salas.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-slate-600">
                  No hay salas disponibles en este momento
                </p>
              </div>
            ) : (
              salas.map((sala) => (
                <div
                  key={sala.id_sala}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-200"
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Building className="text-blue-600" size={80} />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                      {sala.estado}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">
                      {sala.nombre}
                    </h3>
                    <div className="space-y-3 text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-blue-600" />
                        <span>Capacidad: {sala.capacidad} personas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-blue-600" />
                        <span>{sala.ubicación}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard size={18} className="text-blue-600" />
                        <span className="font-semibold text-slate-800">
                          ${sala.precio_arriendo.toLocaleString()}/día
                        </span>
                      </div>
                    </div>
                    {isOrganizerOrAdmin && (
                      <a
                        href={`/eventos/crear?sala=${sala.id_sala}`}
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition text-center"
                      >
                        Reservar Ahora
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Sistema completo de gestión
            </h2>
            <p className="text-blue-200 text-lg">
              Todo lo que necesitas en una sola plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <Shield className="text-blue-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-3">Datos Seguros</h3>
              <p className="text-blue-100">
                Mantenemos tus datos seguros y protegidos.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <Calendar className="text-purple-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-3">Gestiona tus eventos</h3>
              <p className="text-blue-100">
                Crea, edita y elimina eventos con control total de cupos y
                fechas.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <House className="text-green-400 mb-4" size={40} />
              <h3 className="text-2xl font-bold mb-3">
                Desde la comodidad de tu casa
              </h3>
              <p className="text-blue-100">
                Realiza todas tus gestiones sin salir de casa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-slate-800">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Únete a cientos de organizadores que ya confían en Espacio Evento
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-5 rounded-lg font-bold text-lg transition shadow-xl shadow-blue-600/30 inline-flex items-center gap-3">
            Crear Cuenta Gratis
            <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar size={24} />
                </div>
                <span className="text-xl font-bold">Espacio Evento</span>
              </div>
              <p className="text-slate-400 text-sm">
                Plataforma de gestión integral para eventos y arriendo de
                espacios.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Precios
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Términos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>
              © 2025 Espacio Evento. Proyecto desarrollado por Tomás Vásquez,
              Felipe Toro, Miguel Raibel, Katalina Ramírez y Jorge Jara.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
