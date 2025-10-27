'use client';
import React, { useEffect, useState } from 'react';
import { MapPin, Users, DollarSign, Search, Filter, X, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';

interface Sala {
  id_sala: number;
  nombre: string;
  ubicación: string;
  capacidad: number;
  precio_arriendo: number;
  estado: 'disponible' | 'arrendada' | 'inactiva';
}

export default function SalasList() {
  const [salasData, setSalasData] = useState<Sala[]>([]);

  useEffect(() => {
    fetchSalas();
  }, []);

  const fetchSalas = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/salas`);
      const data = await response.json();
      setSalasData(data);
    } catch (error) {
      console.error('Error fetching salas:', error);
    }
  };

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [capacidadMin, setCapacidadMin] = useState<string>('');
  const [capacidadMax, setCapacidadMax] = useState<string>('');
  const [precioMax, setPrecioMax] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('nombre');

  // Filtrar salas
  const filteredSalas = salasData.filter(sala => {
    const matchSearch = sala.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sala.ubicación.toLowerCase().includes(searchTerm.toLowerCase());

    const matchEstado = selectedEstado === 'todos' || sala.estado === selectedEstado;

    const matchCapacidadMin = !capacidadMin || sala.capacidad >= parseInt(capacidadMin);
    const matchCapacidadMax = !capacidadMax || sala.capacidad <= parseInt(capacidadMax);

    const matchPrecio = !precioMax || sala.precio_arriendo <= parseInt(precioMax);

    return matchSearch && matchEstado && matchCapacidadMin && matchCapacidadMax && matchPrecio;
  });

  // Ordenar salas
  const sortedSalas = [...filteredSalas].sort((a, b) => {
    switch (sortBy) {
      case 'nombre':
        return a.nombre.localeCompare(b.nombre);
      case 'capacidad':
        return b.capacidad - a.capacidad;
      case 'precio':
        return a.precio_arriendo - b.precio_arriendo;
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedEstado('todos');
    setCapacidadMin('');
    setCapacidadMax('');
    setPrecioMax('');
  };

  const getEstadoBadge = (estado: string) => {
    const styles = {
      disponible: 'bg-green-100 text-green-700 border-green-200',
      arrendada: 'bg-red-100 text-red-700 border-red-200',
      inactiva: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    const labels = {
      disponible: 'Disponible',
      arrendada: 'Arrendada',
      inactiva: 'Inactiva'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[estado as keyof typeof styles]}`}>
        {labels[estado as keyof typeof labels]}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="pt-24 max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Salas Disponibles</h1>
          <p className="text-lg text-slate-600">Encuentra el espacio perfecto para tu evento</p>
        </div>
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o ubicación..."
                className="w-full pl-11 text-black pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none text-black pl-4 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
              >
                <option value="nombre">Ordenar: Nombre</option>
                <option value="capacidad">Ordenar: Capacidad</option>
                <option value="precio">Ordenar: Precio</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              <Filter size={20} />
              Filtros
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Estado Filter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Estado</label>
                  <select
                    value={selectedEstado}
                    onChange={(e) => setSelectedEstado(e.target.value)}
                    className="w-full px-4 text-black py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="todos">Todos</option>
                    <option value="disponible">Disponible</option>
                    <option value="arrendada">Arrendada</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>

                {/* Capacidad Min */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Capacidad Mínima</label>
                  <input
                    type="number"
                    value={capacidadMin}
                    onChange={(e) => setCapacidadMin(e.target.value)}
                    placeholder="Ej: 50"
                    className="w-full px-4 text-black py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Capacidad Max */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Capacidad Máxima</label>
                  <input
                    type="number"
                    value={capacidadMax}
                    onChange={(e) => setCapacidadMax(e.target.value)}
                    placeholder="Ej: 200"
                    className="w-full px-4 text-black py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Precio Max */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Precio Máximo</label>
                  <input
                    type="number"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}
                    placeholder="Ej: 100000"
                    className="w-full px-4 text-black py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition"
                >
                  <X size={18} />
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-slate-600">
            Mostrando <span className="font-semibold text-slate-800">{sortedSalas.length}</span> de{' '}
            <span className="font-semibold text-slate-800">{salasData.length}</span> salas
          </p>
        </div>

        {/* Salas Grid */}
        {sortedSalas.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSalas.map((sala) => (
              <div
                key={sala.id_sala}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border border-slate-200 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                  <div className="absolute top-4 right-4">
                    {getEstadoBadge(sala.estado)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <h3 className="text-2xl font-bold mb-2">{sala.nombre}</h3>
                      <p className="text-blue-100 flex items-center justify-center gap-1">
                        <MapPin size={16} />
                        {sala.ubicación}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users size={18} className="text-blue-600" />
                        <span className="text-sm font-medium">Capacidad</span>
                      </div>
                      <span className="font-semibold text-slate-800">{sala.capacidad} personas</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600">
                        <DollarSign size={18} className="text-green-600" />
                        <span className="text-sm font-medium">Precio</span>
                      </div>
                      <span className="font-semibold text-slate-800">{formatPrice(sala.precio_arriendo)}</span>
                    </div>
                  </div>

                  <button
                    disabled={sala.estado !== 'disponible'}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      sala.estado === 'disponible'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {sala.estado === 'disponible' ? 'Reservar Sala' : 'No Disponible'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No se encontraron salas</h3>
            <p className="text-slate-600 mb-4">Intenta ajustar tus filtros de búsqueda</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}