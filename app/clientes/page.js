'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Badge from '@/components/Badge';
import ConfirmModal from '@/components/ConfirmModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageHeader from '@/components/PageHeader';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buscar, setBuscar] = useState('');
  const [eliminarId, setEliminarId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      cargarClientes(mounted);
    }, 300);
    return () => { mounted = false; clearTimeout(timer); };
  }, [buscar]);

  async function cargarClientes(mounted = true) {
    try {
      setLoading(true);
      const params = new URLSearchParams({ buscar });
      const res = await fetch(`/api/clientes?${params}`);
      if (!res.ok) throw new Error('Error al cargar clientes');
      const data = await res.json();
      if (mounted) setClientes(data);
    } catch (err) {
      if (mounted) setError(err.message);
    } finally {
      if (mounted) setLoading(false);
    }
  }

  async function eliminarCliente() {
    try {
      const res = await fetch(`/api/clientes/${eliminarId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      setEliminarId(null);
      cargarClientes();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
      setEliminarId(null);
    }
  }

  return (
    <div>
      <PageHeader titulo="Clientes" descripcion="Gestión de clientes del taller" botonTexto="Nuevo Cliente" botonHref="/clientes/nuevo" />

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, apellidos, email o DNI..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="input max-w-md"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="p-8 text-center text-red-500">⚠️ {error}</div>
        ) : clientes.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-5xl mb-3">👥</p>
            <p className="text-gray-500 font-medium">No se encontraron clientes</p>
            {buscar && <p className="text-gray-400 text-sm mt-1">Prueba con otro término de búsqueda</p>}
            <Link href="/clientes/nuevo" className="mt-4 inline-block btn-primary">+ Nuevo Cliente</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="table-header">Cliente</th>
                  <th className="table-header">DNI</th>
                  <th className="table-header">Contacto</th>
                  <th className="table-header">Vehículos</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clientes.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell">
                      <Link href={`/clientes/${c.id}`} className="font-medium text-blue-600 hover:text-blue-700">
                        {c.nombre} {c.apellidos}
                      </Link>
                    </td>
                    <td className="table-cell text-gray-500">{c.dni || '—'}</td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-700">{c.email || '—'}</div>
                      <div className="text-xs text-gray-400">{c.telefono || '—'}</div>
                    </td>
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-1">
                        {c.vehiculos?.length > 0 ? (
                          c.vehiculos.map((v) => (
                            <Link key={v.id} href={`/vehiculos/${v.id}`}>
                              <Badge texto={v.estado} />
                            </Link>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">Sin vehículos</span>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Link href={`/clientes/${c.id}`} className="btn-secondary text-xs">Ver</Link>
                        <Link href={`/clientes/editar/${c.id}`} className="btn-secondary text-xs">Editar</Link>
                        <button onClick={() => setEliminarId(c.id)} className="btn-danger text-xs">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3">{!loading && !error && `${clientes.length} cliente(s) encontrado(s)`}</p>

      {eliminarId && (
        <ConfirmModal
          mensaje="¿Seguro que quieres eliminar este cliente? Se eliminarán también todos sus vehículos y reparaciones asociadas."
          onConfirmar={eliminarCliente}
          onCancelar={() => setEliminarId(null)}
        />
      )}
    </div>
  );
}
