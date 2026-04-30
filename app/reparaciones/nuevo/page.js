'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ESTADOS = ['Pendiente', 'En Proceso', 'Completada', 'Cancelada'];

export default function NuevaReparacionPage() {
  const router = useRouter();
  const [form, setForm] = useState({ id_vehiculo: '', id_pieza: '', fecha_entrada: new Date().toISOString().slice(0, 10), fecha_salida: '', descripcion: '', coste: '', estado: 'Pendiente' });
  const [vehiculos, setVehiculos] = useState([]);
  const [piezas, setPiezas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/vehiculos').then(r => r.json()),
      fetch('/api/piezas').then(r => r.json()),
    ]).then(([v, p]) => { setVehiculos(v); setPiezas(p); }).catch(() => {});
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = { ...form, coste: form.coste !== '' ? Number(form.coste) : 0, id_pieza: form.id_pieza || null, fecha_salida: form.fecha_salida || null };
      const res = await fetch('/api/reparaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear reparación');
      router.push('/reparaciones');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/reparaciones" className="text-blue-600 hover:text-blue-700 text-sm">← Volver a Reparaciones</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Nueva Reparación</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="label">Vehículo <span className="text-red-500">*</span></label>
          <select name="id_vehiculo" value={form.id_vehiculo} onChange={handleChange} required className="input">
            <option value="">— Selecciona un vehículo —</option>
            {vehiculos.map((v) => (
              <option key={v.id} value={v.id}>{v.matricula} — {v.marca} {v.modelo} ({v.cliente?.nombre || '?'})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Pieza utilizada</label>
          <select name="id_pieza" value={form.id_pieza} onChange={handleChange} className="input">
            <option value="">— Sin pieza (opcional) —</option>
            {piezas.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre} [{p.referencia}] — Stock: {p.stock}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Descripción del trabajo <span className="text-red-500">*</span></label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required rows={3} className="input resize-none" placeholder="Describe el trabajo a realizar o realizado..." minLength={5} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Fecha de entrada <span className="text-red-500">*</span></label>
            <input name="fecha_entrada" type="date" value={form.fecha_entrada} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="label">Fecha de salida</label>
            <input name="fecha_salida" type="date" value={form.fecha_salida} onChange={handleChange} min={form.fecha_entrada} className="input" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Coste (€)</label>
            <input name="coste" type="number" step="0.01" min="0" value={form.coste} onChange={handleChange} className="input" placeholder="0.00" />
          </div>
          <div>
            <label className="label">Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange} className="input">
              {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Guardando...' : '💾 Guardar Reparación'}
          </button>
          <Link href="/reparaciones" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
