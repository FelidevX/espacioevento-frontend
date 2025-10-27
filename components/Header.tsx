'use client';
import React from 'react';
import { Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 focus:outline-none cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-slate-800">Espacio Evento</span>
          </button>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <a href="/salas" className="text-slate-600 hover:text-blue-600 transition">Salas</a>
          <a href="#como-funciona" className="text-slate-600 hover:text-blue-600 transition">Cómo Funciona</a>
          <a href="#precios" className="text-slate-600 hover:text-blue-600 transition">Precios</a>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition cursor-pointer" onClick={() => router.push('/login')}>
            Iniciar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}