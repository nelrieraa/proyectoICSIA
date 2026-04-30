'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TIPOS = ['Inicial', 'Revisión', 'Final', 'Urgente'];
const ESTADOS = ['Pendiente', 'En Proceso', 'Completado'];
const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Crítica'];

export default function NuevoDiagnosticoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    id_reparacion_mysql: '',
    id_vehiculo_mysql: '',
    matricula: '',
    tipo_diagnostico: 'Inicial',
    descripcion_tecnica: '',
    estado: 'Pendiente',
    prioridad: 'Media',
    metadatos_tecnicos: '{}',
    notas_adicionales: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    // Validar JSON de metadatos
    try {
      JSON.parse(form.metadatos_tecnicos || '{}');
    } catch {
      setError('Los metadatos técnicos no son un JSON válido. Ejemplo: {"kilometraje": 80000}');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        metadatos_tecnicos: JSON.parse(form.metadatos_tecnicos || '{}'),
        id_reparacion_mysql: form.id_reparacion_mysql ? Number(form.id_reparacion_mysql) : undefined,
        id_vehiculo_mysql: form.id_vehiculo_mysql ? Number(form.id_vehiculo_mysql) : undefined,
      };
      const res = await fetch('/api/diagnosticos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear diagnóstico');
      router.push('/diagnosticos');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/diagnosticos" className="text-blue-600 hover:text-blue-700 text-sm">← Volver a Diagnósticos</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Nuevo Diagnóstico</h1>
        <p className="text-gray-500 text-sm mt-1">Se guardará en MongoDB con metadatos técnicos flexibles.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">ID Reparación MySQL</label>
            <input name="id_reparacion_mysql" type="number" min="1" value={form.id_reparacion_mysql} onChange={handleChange} className="input" placeholder="Ej: 3" />
          </div>
          <div>
            <label className="label">ID Vehículo MySQL</label>
            <input name="id_vehiculo_mysql" type="number" min="1" value={form.id_vehiculo_mysql} onChange={handleChange} className="input" placeholder="Ej: 2" />
          </div>
        </div>

        <div>
          <label className="label">Matrícula del vehículo</label>
          <input name="matricula" value={form.matricula} onChange={handleChange} className="input uppercase" placeholder="Ej: 5678-DEF" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Tipo <span className="text-red-500">*</span></label>
            <select name="tipo_diagnostico" value={form.tipo_diagnostico} onChange={handleChange} className="input">
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Prioridad <span className="text-red-500">*</span></label>
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
          <textarea name="descripcion_tecnica" value={form.descripcion_tecnica} onChange={handleChange} required rows={4} className="input resize-none" placeholder="Describe el diagnóstico técnico detallado..." />
        </div>

        <div>
          <label className="label">Metadatos técnicos (JSON)</label>
          <textarea
            name="metadatos_tecnicos"
            value={form.metadatos_tecnicos}
            onChange={handleChange}
            rows={4}
            className="input resize-none font-mono text-xs"
            placeholder={'{\n  "kilometraje": 85000,\n  "nivel_aceite": "OK",\n  "codigo_error_obd": "C0035"\n}'}
          />
          <p className="text-xs text-gray-400 mt-1">Campos flexibles: cualquier dato técnico en formato JSON. Ej: kilometraje, presiones, códigos OBD, nivel batería...</p>
        </div>

        <div>
          <label className="label">Notas adicionales</label>
          <textarea name="notas_adicionales" value={form.notas_adicionales} onChange={handleChange} rows={2} className="input resize-none" placeholder="Observaciones o comentarios del técnico..." />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Guardando...' : '💾 Guardar Diagnóstico'}
          </button>
          <Link href="/diagnosticos" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
