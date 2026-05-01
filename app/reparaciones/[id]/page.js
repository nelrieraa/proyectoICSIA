'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ReparacionDetallePage() {
  const { id } = useParams();
  const [reparacion, setReparacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch(`/api/reparaciones/${id}`);
        if (res.status === 404) { setError('404'); return; }
        if (!res.ok) throw new Error('Error al cargar reparación');
        setReparacion(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error === '404') return <div className="text-center py-20"><p className="text-5xl mb-3">🔧</p><p className="text-gray-600">Reparación no encontrada</p><Link href="/reparaciones" className="mt-4 inline-block text-blue-600">← Volver</Link></div>;
  if (error) return <div className="text-red-500 p-6">⚠️ {error}</div>;

  const cliente = reparacion.vehiculo?.cliente;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 flex-wrap">
        <Link href="/reparaciones" className="hover:text-blue-600">Reparaciones</Link>
        <span>/</span>
        {reparacion.vehiculo && <Link href={`/vehiculos/${reparacion.vehiculo.id}`} className="hover:text-blue-600 font-mono">{reparacion.vehiculo.matricula}</Link>}
        <span>/</span>
        <span className="text-gray-900 font-medium">Reparación #{reparacion.id}</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Reparación #{reparacion.id}</h1>
            <p className="text-gray-600 mt-1">{reparacion.descripcion}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge texto={reparacion.estado} />
            <Link href={`/reparaciones/editar/${reparacion.id}`} className="btn-secondary">✏️ Editar</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Coste</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{Number(reparacion.coste).toFixed(2)}€</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha entrada</p>
            <p className="font-medium mt-1">{new Date(reparacion.fecha_entrada).toLocaleDateString('es-ES')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha salida</p>
            <p className="font-medium mt-1">{reparacion.fecha_salida ? new Date(reparacion.fecha_salida).toLocaleDateString('es-ES') : 'Pendiente'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Pieza usada</p>
            <p className="font-medium mt-1">
              {reparacion.pieza ? (
                <Link href="/piezas" className="text-blue-600 hover:underline">{reparacion.pieza.nombre}</Link>
              ) : '— ninguna'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {reparacion.vehiculo && (
          <Link href={`/vehiculos/${reparacion.vehiculo.id}`}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Vehículo</p>
              <p className="text-2xl mb-1">🚗</p>
              <p className="font-bold text-gray-900">{reparacion.vehiculo.marca} {reparacion.vehiculo.modelo}</p>
              <p className="font-mono text-gray-600 text-sm">{reparacion.vehiculo.matricula}</p>
              <p className="text-blue-600 text-xs mt-2">Ver ficha del vehículo →</p>
            </div>
          </Link>
        )}

        {cliente && (
          <Link href={`/clientes/${cliente.id}`}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Cliente</p>
              <p className="text-2xl mb-1">👤</p>
              <p className="font-bold text-gray-900">{cliente.nombre} {cliente.apellidos}</p>
              <p className="text-gray-500 text-sm">{cliente.email || cliente.telefono || '—'}</p>
              <p className="text-blue-600 text-xs mt-2">Ver ficha del cliente →</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
