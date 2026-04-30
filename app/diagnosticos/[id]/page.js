'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/Badge';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DiagnosticoDetallePage() {
  const { id } = useParams();
  const [diag, setDiag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch(`/api/diagnosticos/${id}`);
        if (res.status === 404) { setError('404'); return; }
        if (!res.ok) throw new Error('Error al cargar diagnóstico');
        setDiag(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error === '404') return <div className="text-center py-20"><p className="text-5xl mb-3">📋</p><p className="text-gray-600">Diagnóstico no encontrado</p><Link href="/diagnosticos" className="mt-4 inline-block text-blue-600">← Volver</Link></div>;
  if (error) return <div className="text-red-500 p-6">⚠️ {error}</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link href="/diagnosticos" className="hover:text-blue-600">Diagnósticos</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{diag.tipo_diagnostico} — {diag.matricula || 'Sin matrícula'}</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge texto={diag.prioridad} />
            <Badge texto={diag.estado} />
            <span className="text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{diag.tipo_diagnostico}</span>
          </div>
          <Link href={`/diagnosticos/editar/${diag._id}`} className="btn-secondary">✏️ Editar</Link>
        </div>

        <h1 className="text-lg font-bold text-gray-900 mb-3">{diag.descripcion_tecnica}</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Matrícula</p>
            <p className="font-mono font-semibold mt-1">{diag.matricula || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">ID Reparación MySQL</p>
            <p className="font-medium mt-1">
              {diag.id_reparacion_mysql ? (
                <Link href={`/reparaciones/${diag.id_reparacion_mysql}`} className="text-blue-600 hover:underline">#{diag.id_reparacion_mysql}</Link>
              ) : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha</p>
            <p className="font-medium mt-1">{new Date(diag.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {diag.notas_adicionales && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Notas adicionales</p>
            <p className="text-gray-700 text-sm">{diag.notas_adicionales}</p>
          </div>
        )}
      </div>

      {/* Metadatos técnicos — campo flexible MongoDB */}
      {diag.metadatos_tecnicos && Object.keys(diag.metadatos_tecnicos).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">🔬 Metadatos técnicos <span className="text-xs font-normal text-gray-400">(campo flexible MongoDB)</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(diag.metadatos_tecnicos).map(([clave, valor]) => (
              <div key={clave} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 capitalize">{clave.replace(/_/g, ' ')}</p>
                <p className="font-medium text-gray-900 text-sm mt-0.5 break-all">
                  {typeof valor === 'object' ? JSON.stringify(valor) : String(valor)}
                </p>
              </div>
            ))}
          </div>
          <details className="mt-4">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">Ver JSON raw</summary>
            <pre className="mt-2 bg-gray-900 text-green-400 text-xs p-4 rounded-lg overflow-auto">
              {JSON.stringify(diag.metadatos_tecnicos, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
