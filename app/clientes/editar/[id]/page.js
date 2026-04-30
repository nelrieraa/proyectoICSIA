'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditarClientePage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch(`/api/clientes/${id}`);
        if (!res.ok) throw new Error('Cliente no encontrado');
        const data = await res.json();
        setForm({ nombre: data.nombre || '', apellidos: data.apellidos || '', email: data.email || '', telefono: data.telefono || '', direccion: data.direccion || '', dni: data.dni || '' });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const res = await fetch(`/api/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar');
      router.push(`/clientes/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!form && error) return <div className="text-red-500 p-6">⚠️ {error}</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href={`/clientes/${id}`} className="text-blue-600 hover:text-blue-700 text-sm">← Volver al cliente</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Editar Cliente</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Nombre <span className="text-red-500">*</span></label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required className="input" />
          </div>
          <div>
            <label className="label">Apellidos <span className="text-red-500">*</span></label>
            <input name="apellidos" value={form.apellidos} onChange={handleChange} required className="input" />
          </div>
        </div>
        <div>
          <label className="label">DNI / NIE</label>
          <input name="dni" value={form.dni} onChange={handleChange} className="input" pattern="[0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z]" maxLength={10} />
        </div>
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="label">Teléfono</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} className="input" pattern="[0-9]{9}" maxLength={15} />
        </div>
        <div>
          <label className="label">Dirección</label>
          <input name="direccion" value={form.direccion} onChange={handleChange} className="input" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={guardando} className="btn-primary disabled:opacity-50">
            {guardando ? 'Guardando...' : '💾 Guardar Cambios'}
          </button>
          <Link href={`/clientes/${id}`} className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
