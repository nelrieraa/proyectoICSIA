'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

const ESTADOS = ['Activo', 'En Reparación', 'Reparado', 'Dado de Baja'];

export default function EditarVehiculoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/vehiculos/${id}`).then((r) => r.json()),
      fetch('/api/clientes').then((r) => r.json()),
    ])
      .then(([v, c]) => {
        setForm({ id_cliente: v.id_cliente, marca: v.marca, modelo: v.modelo, matricula: v.matricula, anio: v.anio || '', color: v.color || '', estado: v.estado });
        setClientes(c);
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
    setGuardando(true);
    try {
      const res = await fetch(`/api/vehiculos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, anio: form.anio ? Number(form.anio) : null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar');
      router.push(`/vehiculos/${id}`);
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
        <Link href={`/vehiculos/${id}`} className="text-blue-600 hover:text-blue-700 text-sm">← Volver al vehículo</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Editar Vehículo</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">⚠️ {error}</div>}

      {form && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="label">Propietario <span className="text-red-500">*</span></label>
            <select name="id_cliente" value={form.id_cliente} onChange={handleChange} required className="input">
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre} {c.apellidos}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Marca <span className="text-red-500">*</span></label>
              <input name="marca" value={form.marca} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="label">Modelo <span className="text-red-500">*</span></label>
              <input name="modelo" value={form.modelo} onChange={handleChange} required className="input" />
            </div>
          </div>
          <div>
            <label className="label">Matrícula <span className="text-red-500">*</span></label>
            <input name="matricula" value={form.matricula} onChange={handleChange} required className="input uppercase" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Año</label>
              <input name="anio" type="number" value={form.anio} onChange={handleChange} min="1900" max={new Date().getFullYear() + 1} className="input" />
            </div>
            <div>
              <label className="label">Color</label>
              <input name="color" value={form.color} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange} className="input">
                {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={guardando} className="btn-primary disabled:opacity-50">
              {guardando ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
            <Link href={`/vehiculos/${id}`} className="btn-secondary">Cancelar</Link>
          </div>
        </form>
      )}
    </div>
  );
}
