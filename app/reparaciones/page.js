'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Badge from '@/components/Badge';
import ConfirmModal from '@/components/ConfirmModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageHeader from '@/components/PageHeader';
import { useSearchParams } from 'next/navigation';

const ESTADOS = ['', 'Pendiente', 'En Proceso', 'Completada', 'Cancelada'];

function ReparacionesContent() {
  const searchParams = useSearchParams();
  const [reparaciones, setReparaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buscar, setBuscar] = useState('');
  const [estado, setEstado] = useState(searchParams.get('estado') || '');
  const [eliminarId, setEliminarId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => cargarReparaciones(mounted), 300);
    return () => { mounted = false; clearTimeout(timer); };
  }, [buscar, estado]);

  async function cargarReparaciones(mounted = true) {
    try {
      setLoading(true);
      const params = new URLSearchParams({ buscar, estado });
      const res = await fetch(`/api/reparaciones?${params}`);
      if (!res.ok) throw new Error('Error al cargar reparaciones');
      const data = await res.json();
      if (mounted) setReparaciones(data);
    } catch (err) {
      if (mounted) setError(err.message);
    } finally {
      if (mounted) setLoading(false);
    }
  }

  async function eliminarReparacion() {
    try {
      const res = await fetch(`/api/reparaciones/${eliminarId}`, { method: 'DELETE' });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setEliminarId(null);
      cargarReparaciones();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
      setEliminarId(null);
    }
  }

  return (
    <div>
      <PageHeader titulo="Reparaciones" descripcion="Gestión de reparaciones del taller" botonTexto="Nueva Reparación" botonHref="/reparaciones/nuevo" />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <input type="text" placeholder="🔍 Buscar en descripción..." value={buscar} onChange={(e) => setBuscar(e.target.value)} className="input flex-1 min-w-52" />
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="input w-44">
            {ESTADOS.map((e) => <option key={e} value={e}>{e || 'Todos los estados'}</option>)}
          </select>
          {(buscar || estado) && (
            <button onClick={() => { setBuscar(''); setEstado(''); }} className="btn-secondary text-xs">✕ Limpiar</button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <LoadingSpinner /> : error ? (
          <div className="p-8 text-center text-red-500">⚠️ {error}</div>
        ) : reparaciones.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-5xl mb-3">🔧</p>
            <p className="text-gray-500 font-medium">No se encontraron reparaciones</p>
            <Link href="/reparaciones/nuevo" className="mt-4 inline-block btn-primary">+ Nueva Reparación</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="table-header">#</th>
                  <th className="table-header">Descripción</th>
                  <th className="table-header">Vehículo</th>
                  <th className="table-header">Cliente</th>
                  <th className="table-header">Pieza</th>
                  <th className="table-header">Entrada</th>
                  <th className="table-header">Coste</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reparaciones.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell text-gray-400 text-xs">#{r.id}</td>
                    <td className="table-cell max-w-xs">
                      <Link href={`/reparaciones/${r.id}`} className="text-blue-600 hover:underline font-medium">
                        <span className="line-clamp-2">{r.descripcion}</span>
                      </Link>
                    </td>
                    <td className="table-cell">
                      {r.vehiculo ? (
                        <Link href={`/vehiculos/${r.vehiculo.id}`} className="text-sm font-medium text-gray-700 hover:text-blue-600">
                          <span className="font-mono">{r.vehiculo.matricula}</span>
                          <span className="block text-xs text-gray-400">{r.vehiculo.marca} {r.vehiculo.modelo}</span>
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="table-cell">
                      {r.vehiculo?.cliente ? (
                        <Link href={`/clientes/${r.vehiculo.cliente.id}`} className="text-sm text-blue-600 hover:underline">
                          {r.vehiculo.cliente.nombre} {r.vehiculo.cliente.apellidos}
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="table-cell text-sm text-gray-500">{r.pieza?.nombre || '—'}</td>
                    <td className="table-cell text-sm">{new Date(r.fecha_entrada).toLocaleDateString('es-ES')}</td>
                    <td className="table-cell font-semibold text-gray-900">{Number(r.coste).toFixed(2)}€</td>
                    <td className="table-cell"><Badge texto={r.estado} /></td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Link href={`/reparaciones/${r.id}`} className="btn-secondary text-xs">Ver</Link>
                        <Link href={`/reparaciones/editar/${r.id}`} className="btn-secondary text-xs">Editar</Link>
                        <button onClick={() => setEliminarId(r.id)} className="btn-danger text-xs">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">{!loading && !error && `${reparaciones.length} reparación(es) encontrada(s)`}</p>

      {eliminarId && (
        <ConfirmModal
          mensaje="¿Seguro que quieres eliminar esta reparación? Esta acción no se puede deshacer."
          onConfirmar={eliminarReparacion}
          onCancelar={() => setEliminarId(null)}
        />
      )}
    </div>
  );
}

export default function Page() {
  return <Suspense><ReparacionesContent /></Suspense>;
}
