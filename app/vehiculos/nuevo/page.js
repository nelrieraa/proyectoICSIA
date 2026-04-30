'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ESTADOS = ['Activo', 'En Reparación', 'Reparado', 'Dado de Baja'];

export default function NuevoVehiculoPage() {
  const router = useRouter();
  const [form, setForm] = useState({ id_cliente: '', marca: '', modelo: '', matricula: '', anio: '', color: '', estado: 'Activo' });
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/clientes').then(r => r.json()).then(setClientes).catch(() => {});
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/vehiculos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, anio: form.anio ? Number(form.anio) : null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear vehículo');
      router.push('/vehiculos');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/vehiculos" className="text-blue-600 hover:text-blue-700 text-sm">← Volver a Vehículos</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Nuevo Vehículo</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="label">Propietario (Cliente) <span className="text-red-500">*</span></label>
          <select name="id_cliente" value={form.id_cliente} onChange={handleChange} required className="input">
            <option value="">— Selecciona un cliente —</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre} {c.apellidos} {c.dni ? `(${c.dni})` : ''}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Marca <span className="text-red-500">*</span></label>
            <input name="marca" value={form.marca} onChange={handleChange} required className="input" placeholder="Ej: Toyota" />
          </div>
          <div>
            <label className="label">Modelo <span className="text-red-500">*</span></label>
            <input name="modelo" value={form.modelo} onChange={handleChange} required className="input" placeholder="Ej: Corolla" />
          </div>
        </div>

        <div>
          <label className="label">Matrícula <span className="text-red-500">*</span></label>
          <input name="matricula" value={form.matricula} onChange={handleChange} required className="input uppercase" placeholder="Ej: 1234-ABC" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Año</label>
            <input name="anio" type="number" value={form.anio} onChange={handleChange} min="1900" max={new Date().getFullYear() + 1} className="input" placeholder={new Date().getFullYear()} />
          </div>
          <div>
            <label className="label">Color</label>
            <input name="color" value={form.color} onChange={handleChange} className="input" placeholder="Ej: Blanco" />
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
            {loading ? 'Guardando...' : '💾 Guardar Vehículo'}
          </button>
          <Link href="/vehiculos" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
