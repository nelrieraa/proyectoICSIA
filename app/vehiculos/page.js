'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Badge from '@/components/Badge';
import ConfirmModal from '@/components/ConfirmModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageHeader from '@/components/PageHeader';
import { useSearchParams } from 'next/navigation';

const ESTADOS = ['', 'Activo', 'En Reparación', 'Reparado', 'Dado de Baja'];

export default function VehiculosPage() {
  const searchParams = useSearchParams();
  const [vehiculos, setVehiculos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buscar, setBuscar] = useState('');
  const [estado, setEstado] = useState(searchParams.get('estado') || '');
  const [marca, setMarca] = useState('');
  const [eliminarId, setEliminarId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => cargarVehiculos(mounted), 300);
    return () => { mounted = false; clearTimeout(timer); };
  }, [buscar, estado, marca]);

  async function cargarVehiculos(mounted = true) {
    try {
      setLoading(true);
      const params = new URLSearchParams({ buscar, estado, marca });
      const res = await fetch(`/api/vehiculos?${params}`);
      if (!res.ok) throw new Error('Error al cargar vehículos');
      const data = await res.json();
      if (mounted) {
        setVehiculos(data);
        const marcasUnicas = [...new Set(data.map((v) => v.marca))].sort();
        setMarcas(marcasUnicas);
      }
    } catch (err) {
      if (mounted) setError(err.message);
    } finally {
      if (mounted) setLoading(false);
    }
  }

  async function eliminarVehiculo() {
    try {
      const res = await fetch(`/api/vehiculos/${eliminarId}`, { method: 'DELETE' });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setEliminarId(null);
      cargarVehiculos();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
      setEliminarId(null);
    }
  }

  return (
    <div>
      <PageHeader titulo="Vehículos" descripcion="Inventario de vehículos del taller" botonTexto="Nuevo Vehículo" botonHref="/vehiculos/nuevo" />

      {/* Filtros — 3 filtros combinados */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="🔍 Buscar matrícula, marca o modelo..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="input flex-1 min-w-52"
          />
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="input w-44">
            {ESTADOS.map((e) => <option key={e} value={e}>{e || 'Todos los estados'}</option>)}
          </select>
          <select value={marca} onChange={(e) => setMarca(e.target.value)} className="input w-40">
            <option value="">Todas las marcas</option>
            {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          {(buscar || estado || marca) && (
            <button onClick={() => { setBuscar(''); setEstado(''); setMarca(''); }} className="btn-secondary text-xs">
              ✕ Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <LoadingSpinner /> : error ? (
          <div className="p-8 text-center text-red-500">⚠️ {error}</div>
        ) : vehiculos.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-5xl mb-3">🚗</p>
            <p className="text-gray-500 font-medium">No se encontraron vehículos</p>
            <Link href="/vehiculos/nuevo" className="mt-4 inline-block btn-primary">+ Nuevo Vehículo</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="table-header">Matrícula</th>
                  <th className="table-header">Vehículo</th>
                  <th className="table-header">Propietario</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vehiculos.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell">
                      <Link href={`/vehiculos/${v.id}`} className="font-mono font-semibold text-blue-600 hover:text-blue-700">
                        {v.matricula}
                      </Link>
                    </td>
                    <td className="table-cell">
                      <p className="font-medium text-gray-900">{v.marca} {v.modelo}</p>
                      <p className="text-xs text-gray-400">{v.anio || '—'} · {v.color || '—'}</p>
                    </td>
                    {/* Navegación contextual: desde vehículo → cliente */}
                    <td className="table-cell">
                      {v.cliente ? (
                        <Link href={`/clientes/${v.cliente.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                          {v.cliente.nombre} {v.cliente.apellidos}
                        </Link>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="table-cell"><Badge texto={v.estado} /></td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Link href={`/vehiculos/${v.id}`} className="btn-secondary text-xs">Ver</Link>
                        <Link href={`/vehiculos/editar/${v.id}`} className="btn-secondary text-xs">Editar</Link>
                        <button onClick={() => setEliminarId(v.id)} className="btn-danger text-xs">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">{!loading && !error && `${vehiculos.length} vehículo(s) encontrado(s)`}</p>

      {eliminarId && (
        <ConfirmModal
          mensaje="¿Seguro que quieres eliminar este vehículo? Se eliminarán también todas sus reparaciones."
          onConfirmar={eliminarVehiculo}
          onCancelar={() => setEliminarId(null)}
        />
      )}
    </div>
  );
}
