'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function VehiculoDetallePage() {
  const { id } = useParams();
  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch(`/api/vehiculos/${id}`);
        if (res.status === 404) { setError('404'); return; }
        if (!res.ok) throw new Error('Error al cargar vehículo');
        setVehiculo(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error === '404') return <div className="text-center py-20"><p className="text-5xl mb-3">🚗</p><p className="text-gray-600">Vehículo no encontrado</p><Link href="/vehiculos" className="mt-4 inline-block text-blue-600">← Volver</Link></div>;
  if (error) return <div className="text-red-500 p-6">⚠️ {error}</div>;

  const costeTotal = vehiculo.reparaciones?.reduce((sum, r) => sum + Number(r.coste || 0), 0) || 0;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link href="/vehiculos" className="hover:text-blue-600">Vehículos</Link>
        <span>/</span>
        {vehiculo.cliente && (
          <>
            <Link href={`/clientes/${vehiculo.cliente.id}`} className="hover:text-blue-600">{vehiculo.cliente.nombre} {vehiculo.cliente.apellidos}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 font-mono font-semibold">{vehiculo.matricula}</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-3xl">🚗</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{vehiculo.marca} {vehiculo.modelo}</h1>
              <p className="font-mono text-lg text-gray-600">{vehiculo.matricula}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge texto={vehiculo.estado} />
            <Link href={`/vehiculos/editar/${vehiculo.id}`} className="btn-secondary">✏️ Editar</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div><p className="text-xs text-gray-500 uppercase tracking-wide">Año</p><p className="font-medium mt-1">{vehiculo.anio || '—'}</p></div>
          <div><p className="text-xs text-gray-500 uppercase tracking-wide">Color</p><p className="font-medium mt-1">{vehiculo.color || '—'}</p></div>
          <div><p className="text-xs text-gray-500 uppercase tracking-wide">Reparaciones</p><p className="font-medium mt-1">{vehiculo.reparaciones?.length || 0}</p></div>
          <div><p className="text-xs text-gray-500 uppercase tracking-wide">Gasto total</p><p className="font-medium mt-1">{costeTotal.toFixed(2)}€</p></div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Propietario</p>
            {vehiculo.cliente ? (
              <Link href={`/clientes/${vehiculo.cliente.id}`} className="text-blue-600 hover:underline font-medium text-sm mt-1 block">
                {vehiculo.cliente.nombre} {vehiculo.cliente.apellidos}
              </Link>
            ) : <p className="font-medium mt-1">—</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">🔧 Historial de reparaciones</h2>
          <Link href="/reparaciones/nuevo" className="text-blue-600 text-sm hover:underline">+ Nueva reparación</Link>
        </div>

        {!vehiculo.reparaciones || vehiculo.reparaciones.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            <p className="text-4xl mb-2">🔧</p>
            <p>Sin historial de reparaciones</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="table-header">Descripción</th>
                  <th className="table-header">Pieza</th>
                  <th className="table-header">Entrada</th>
                  <th className="table-header">Salida</th>
                  <th className="table-header">Coste</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vehiculo.reparaciones.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="table-cell max-w-xs">
                      <p className="truncate text-gray-800">{r.descripcion}</p>
                    </td>
                    <td className="table-cell text-sm text-gray-500">{r.pieza?.nombre || '—'}</td>
                    <td className="table-cell text-sm">{new Date(r.fecha_entrada).toLocaleDateString('es-ES')}</td>
                    <td className="table-cell text-sm">{r.fecha_salida ? new Date(r.fecha_salida).toLocaleDateString('es-ES') : '—'}</td>
                    <td className="table-cell font-semibold">{Number(r.coste).toFixed(2)}€</td>
                    <td className="table-cell"><Badge texto={r.estado} /></td>
                    <td className="table-cell">
                      <Link href={`/reparaciones/${r.id}`} className="text-blue-600 text-sm hover:underline">Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
