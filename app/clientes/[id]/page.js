'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ClienteDetallePage() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch(`/api/clientes/${id}`);
        if (res.status === 404) { setError('404'); return; }
        if (!res.ok) throw new Error('Error al cargar cliente');
        const data = await res.json();
        setCliente(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error === '404') return (
    <div className="text-center py-20">
      <p className="text-5xl mb-3">👤</p>
      <p className="text-gray-600 font-medium">Cliente no encontrado</p>
      <Link href="/clientes" className="mt-4 inline-block text-blue-600 hover:underline">← Volver a Clientes</Link>
    </div>
  );
  if (error) return <div className="text-red-500 p-6">⚠️ {error}</div>;

  const reparacionesTotal = cliente.vehiculos?.reduce((sum, v) => sum + (v.reparaciones?.length || 0), 0) || 0;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link href="/clientes" className="hover:text-blue-600">Clientes</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{cliente.nombre} {cliente.apellidos}</span>
      </div>

      {/* Cabecera */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl">👤</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{cliente.nombre} {cliente.apellidos}</h1>
              <p className="text-gray-500 text-sm">{cliente.email || 'Sin email'}</p>
            </div>
          </div>
          <Link href={`/clientes/editar/${cliente.id}`} className="btn-secondary">✏️ Editar</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">DNI / NIE</p>
            <p className="font-medium text-gray-900 mt-1">{cliente.dni || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Teléfono</p>
            <p className="font-medium text-gray-900 mt-1">{cliente.telefono || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Dirección</p>
            <p className="font-medium text-gray-900 mt-1">{cliente.direccion || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Cliente desde</p>
            <p className="font-medium text-gray-900 mt-1">{new Date(cliente.created_at).toLocaleDateString('es-ES')}</p>
          </div>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{cliente.vehiculos?.length || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Vehículos</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{reparacionesTotal}</p>
          <p className="text-sm text-gray-500 mt-1">Reparaciones totales</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {cliente.vehiculos?.filter(v => v.estado === 'En Reparación').length || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">En reparación ahora</p>
        </div>
      </div>

      {/* Vehículos del cliente — Navegación contextual */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">🚗 Vehículos del cliente</h2>
          <Link href={`/vehiculos/nuevo`} className="text-blue-600 text-sm hover:underline">+ Añadir vehículo</Link>
        </div>

        {!cliente.vehiculos || cliente.vehiculos.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            <p className="text-4xl mb-2">🚗</p>
            <p>Este cliente no tiene vehículos registrados</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {cliente.vehiculos.map((v) => (
              <Link key={v.id} href={`/vehiculos/${v.id}`}>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚗</span>
                    <div>
                      <p className="font-medium text-gray-900">{v.marca} {v.modelo}</p>
                      <p className="text-sm text-gray-500">Matrícula: <span className="font-mono font-semibold">{v.matricula}</span> · {v.anio || 'Año desconocido'} · {v.color || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{v.reparaciones?.length || 0} rep.</span>
                    <Badge texto={v.estado} />
                    <span className="text-gray-300">›</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
