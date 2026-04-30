'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Badge from '@/components/Badge';
import ConfirmModal from '@/components/ConfirmModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageHeader from '@/components/PageHeader';
import { useSearchParams } from 'next/navigation';

const CATEGORIAS = ['', 'Motor', 'Frenos', 'Suspensión', 'Eléctrico', 'Carrocería', 'Otros'];

export default function PiezasPage() {
  const searchParams = useSearchParams();
  const [piezas, setPiezas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buscar, setBuscar] = useState('');
  const [categoria, setCategoria] = useState('');
  const [bajoStock, setBajoStock] = useState(searchParams.get('bajoStock') === 'true');
  const [eliminarId, setEliminarId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => cargarPiezas(mounted), 300);
    return () => { mounted = false; clearTimeout(timer); };
  }, [buscar, categoria, bajoStock]);

  async function cargarPiezas(mounted = true) {
    try {
      setLoading(true);
      const params = new URLSearchParams({ buscar, categoria, bajoStock: String(bajoStock) });
      const res = await fetch(`/api/piezas?${params}`);
      if (!res.ok) throw new Error('Error al cargar piezas');
      const data = await res.json();
      if (mounted) setPiezas(data);
    } catch (err) {
      if (mounted) setError(err.message);
    } finally {
      if (mounted) setLoading(false);
    }
  }

  async function eliminarPieza() {
    try {
      const res = await fetch(`/api/piezas/${eliminarId}`, { method: 'DELETE' });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setEliminarId(null);
      cargarPiezas();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
      setEliminarId(null);
    }
  }

  return (
    <div>
      <PageHeader titulo="Piezas y Repuestos" descripcion="Inventario de piezas del taller" botonTexto="Nueva Pieza" botonHref="/piezas/nuevo" />

      {/* 3 filtros: búsqueda + categoría + bajo stock */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <input type="text" placeholder="🔍 Buscar por nombre o referencia..." value={buscar} onChange={(e) => setBuscar(e.target.value)} className="input flex-1 min-w-52" />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input w-44">
            {CATEGORIAS.map((c) => <option key={c} value={c}>{c || 'Todas las categorías'}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input type="checkbox" checked={bajoStock} onChange={(e) => setBajoStock(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
            <span className="whitespace-nowrap">⚠️ Solo bajo stock</span>
          </label>
          {(buscar || categoria || bajoStock) && (
            <button onClick={() => { setBuscar(''); setCategoria(''); setBajoStock(false); }} className="btn-secondary text-xs">✕ Limpiar</button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? <LoadingSpinner /> : error ? (
          <div className="p-8 text-center text-red-500">⚠️ {error}</div>
        ) : piezas.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-5xl mb-3">🔩</p>
            <p className="text-gray-500 font-medium">No se encontraron piezas</p>
            <Link href="/piezas/nuevo" className="mt-4 inline-block btn-primary">+ Nueva Pieza</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="table-header">Referencia</th>
                  <th className="table-header">Nombre</th>
                  <th className="table-header">Categoría</th>
                  <th className="table-header">Precio</th>
                  <th className="table-header">Stock</th>
                  <th className="table-header">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {piezas.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-cell font-mono text-sm text-gray-600">{p.referencia}</td>
                    <td className="table-cell">
                      <p className="font-medium text-gray-900">{p.nombre}</p>
                      {p.descripcion && <p className="text-xs text-gray-400 truncate max-w-xs">{p.descripcion}</p>}
                    </td>
                    <td className="table-cell">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{p.categoria}</span>
                    </td>
                    <td className="table-cell font-semibold text-gray-900">{Number(p.precio).toFixed(2)}€</td>
                    <td className="table-cell">
                      <span className={`font-bold text-lg ${p.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>{p.stock}</span>
                      {p.stock < 5 && <span className="ml-1 text-xs text-red-500">⚠️ bajo</span>}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Link href={`/piezas/editar/${p.id}`} className="btn-secondary text-xs">Editar</Link>
                        <button onClick={() => setEliminarId(p.id)} className="btn-danger text-xs">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">{!loading && !error && `${piezas.length} pieza(s) encontrada(s)`}</p>

      {eliminarId && (
        <ConfirmModal
          mensaje="¿Seguro que quieres eliminar esta pieza del inventario? Las reparaciones asociadas quedarán sin pieza asignada."
          onConfirmar={eliminarPieza}
          onCancelar={() => setEliminarId(null)}
        />
      )}
    </div>
  );
}
