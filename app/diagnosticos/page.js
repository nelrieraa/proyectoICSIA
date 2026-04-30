'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Badge from '@/components/Badge';
import ConfirmModal from '@/components/ConfirmModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageHeader from '@/components/PageHeader';
import { useSearchParams } from 'next/navigation';

const ESTADOS = ['', 'Pendiente', 'En Proceso', 'Completado'];
const PRIORIDADES = ['', 'Baja', 'Media', 'Alta', 'Crítica'];

const PRIORIDAD_ICONO = { Baja: '🟢', Media: '🟡', Alta: '🟠', Crítica: '🔴' };

function DiagnosticosContent() {
  const searchParams = useSearchParams();
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buscar, setBuscar] = useState('');
  const [estado, setEstado] = useState(searchParams.get('estado') || '');
  const [prioridad, setPrioridad] = useState(searchParams.get('prioridad') || '');
  const [eliminarId, setEliminarId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => cargarDiagnosticos(mounted), 300);
    return () => { mounted = false; clearTimeout(timer); };
  }, [buscar, estado, prioridad]);

  async function cargarDiagnosticos(mounted = true) {
    try {
      setLoading(true);
      const params = new URLSearchParams({ buscar, estado, prioridad });
      const res = await fetch(`/api/diagnosticos?${params}`);
      if (!res.ok) throw new Error('Error al cargar diagnósticos');
      const data = await res.json();
      if (mounted) setDiagnosticos(data);
    } catch (err) {
      if (mounted) setError(err.message);
    } finally {
      if (mounted) setLoading(false);
    }
  }

  async function eliminarDiagnostico() {
    try {
      const res = await fetch(`/api/diagnosticos/${eliminarId}`, { method: 'DELETE' });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setEliminarId(null);
      cargarDiagnosticos();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
      setEliminarId(null);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Diagnósticos"
        descripcion="Logs técnicos de diagnóstico (MongoDB — datos semiestructurados)"
        botonTexto="Nuevo Diagnóstico"
        botonHref="/diagnosticos/nuevo"
      />

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800">
        📋 Esta sección usa <strong>MongoDB</strong> para almacenar diagnósticos con metadatos técnicos flexibles (códigos OBD, presiones, voltajes, etc.).
      </div>

      {/* 3 filtros combinados */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <input type="text" placeholder="🔍 Buscar en descripción o matrícula..." value={buscar} onChange={(e) => setBuscar(e.target.value)} className="input flex-1 min-w-52" />
          <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} className="input w-40">
            {PRIORIDADES.map((p) => <option key={p} value={p}>{p || 'Todas las prioridades'}</option>)}
          </select>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="input w-40">
            {ESTADOS.map((e) => <option key={e} value={e}>{e || 'Todos los estados'}</option>)}
          </select>
          {(buscar || estado || prioridad) && (
            <button onClick={() => { setBuscar(''); setEstado(''); setPrioridad(''); }} className="btn-secondary text-xs">✕ Limpiar</button>
          )}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-500">⚠️ {error}<br /><span className="text-xs mt-1 block">Verifica que MONGODB_URI está configurada correctamente.</span></div>
      ) : diagnosticos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-5xl mb-3">📋</p>
          <p className="text-gray-500 font-medium">No se encontraron diagnósticos</p>
          <Link href="/diagnosticos/nuevo" className="mt-4 inline-block btn-primary">+ Nuevo Diagnóstico</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {diagnosticos.map((d) => (
            <div key={d._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-lg">{PRIORIDAD_ICONO[d.prioridad] || '⚪'}</span>
                    <Badge texto={d.prioridad} />
                    <Badge texto={d.estado} />
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{d.tipo_diagnostico}</span>
                    {d.matricula && (
                      <Link href={`/vehiculos`} className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full hover:bg-blue-100">
                        🚗 {d.matricula}
                      </Link>
                    )}
                  </div>
                  <p className="text-gray-800 font-medium line-clamp-2">{d.descripcion_tecnica}</p>
                  {d.notas_adicionales && <p className="text-gray-500 text-sm mt-1 line-clamp-1">📝 {d.notas_adicionales}</p>}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    {d.id_reparacion_mysql && <span>Reparación MySQL #{d.id_reparacion_mysql}</span>}
                    <span>{new Date(d.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    {d.metadatos_tecnicos && Object.keys(d.metadatos_tecnicos).length > 0 && (
                      <span className="bg-gray-100 px-2 py-0.5 rounded">{Object.keys(d.metadatos_tecnicos).length} metadatos técnicos</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/diagnosticos/${d._id}`} className="btn-secondary text-xs">Ver</Link>
                  <Link href={`/diagnosticos/editar/${d._id}`} className="btn-secondary text-xs">Editar</Link>
                  <button onClick={() => setEliminarId(d._id)} className="btn-danger text-xs">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-3">{!loading && !error && `${diagnosticos.length} diagnóstico(s) encontrado(s)`}</p>

      {eliminarId && (
        <ConfirmModal
          mensaje="¿Seguro que quieres eliminar este diagnóstico? Esta acción no se puede deshacer."
          onConfirmar={eliminarDiagnostico}
          onCancelar={() => setEliminarId(null)}
        />
      )}
    </div>
  );
}

export default function Page() {
  return <Suspense><DiagnosticosContent /></Suspense>;
}
