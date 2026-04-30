'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

const TIPOS = ['Inicial', 'Revisión', 'Final', 'Urgente'];
const ESTADOS = ['Pendiente', 'En Proceso', 'Completado'];
const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Crítica'];

export default function EditarDiagnosticoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetch(`/api/diagnosticos/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setForm({
          id_reparacion_mysql: d.id_reparacion_mysql || '',
          id_vehiculo_mysql: d.id_vehiculo_mysql || '',
          matricula: d.matricula || '',
          tipo_diagnostico: d.tipo_diagnostico,
          descripcion_tecnica: d.descripcion_tecnica,
          estado: d.estado,
          prioridad: d.prioridad,
          metadatos_tecnicos: JSON.stringify(d.metadatos_tecnicos || {}, null, 2),
          notas_adicionales: d.notas_adicionales || '',
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try { JSON.parse(form.metadatos_tecnicos || '{}'); } catch {
      setError('Los metadatos técnicos no son un JSON válido.');
      return;
    }
    setGuardando(true);
    try {
      const payload = {
        ...form,
        metadatos_tecnicos: JSON.parse(form.metadatos_tecnicos || '{}'),
        id_reparacion_mysql: form.id_reparacion_mysql ? Number(form.id_reparacion_mysql) : undefined,
        id_vehiculo_mysql: form.id_vehiculo_mysql ? Number(form.id_vehiculo_mysql) : undefined,
      };
      const res = await fetch(`/api/diagnosticos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar');
      router.push(`/diagnosticos/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href={`/diagnosticos/${id}`} className="text-blue-600 hover:text-blue-700 text-sm">← Volver al diagnóstico</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Editar Diagnóstico</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">⚠️ {error}</div>}

      {form && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">ID Reparación MySQL</label>
              <input name="id_reparacion_mysql" type="number" min="1" value={form.id_reparacion_mysql} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">ID Vehículo MySQL</label>
              <input name="id_vehiculo_mysql" type="number" min="1" value={form.id_vehiculo_mysql} onChange={handleChange} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Matrícula</label>
            <input name="matricula" value={form.matricula} onChange={handleChange} className="input uppercase" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Tipo</label>
              <select name="tipo_diagnostico" value={form.tipo_diagnostico} onChange={handleChange} className="input">
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Prioridad</label>
              <select name="prioridad" value={form.prioridad} onChange={handleChange} className="input">
                {PRIORIDADES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className="input">
                {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Descripción técnica <span className="text-red-500">*</span></label>
            <textarea name="descripcion_tecnica" value={form.descripcion_tecnica} onChange={handleChange} required rows={4} className="input resize-none" />
          </div>
          <div>
            <label className="label">Metadatos técnicos (JSON)</label>
            <textarea name="metadatos_tecnicos" value={form.metadatos_tecnicos} onChange={handleChange} rows={5} className="input resize-none font-mono text-xs" />
          </div>
          <div>
            <label className="label">Notas adicionales</label>
            <textarea name="notas_adicionales" value={form.notas_adicionales} onChange={handleChange} rows={2} className="input resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={guardando} className="btn-primary disabled:opacity-50">
              {guardando ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
            <Link href={`/diagnosticos/${id}`} className="btn-secondary">Cancelar</Link>
          </div>
        </form>
      )}
    </div>
  );
}
