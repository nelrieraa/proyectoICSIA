'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NuevoClientePage() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', telefono: '', direccion: '', dni: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear cliente');
      router.push('/clientes');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/clientes" className="text-blue-600 hover:text-blue-700 text-sm">← Volver a Clientes</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Nuevo Cliente</h1>
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
            <input name="nombre" value={form.nombre} onChange={handleChange} required className="input" placeholder="Ej: Carlos" />
          </div>
          <div>
            <label className="label">Apellidos <span className="text-red-500">*</span></label>
            <input name="apellidos" value={form.apellidos} onChange={handleChange} required className="input" placeholder="Ej: García López" />
          </div>
        </div>

        <div>
          <label className="label">DNI / NIE</label>
          <input name="dni" value={form.dni} onChange={handleChange} className="input" placeholder="Ej: 12345678A" pattern="[0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z]" title="Formato: 8 dígitos + letra (ej: 12345678A)" maxLength={10} />
        </div>

        <div>
          <label className="label">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="Ej: cliente@email.com" />
        </div>

        <div>
          <label className="label">Teléfono</label>
          <input name="telefono" value={form.telefono} onChange={handleChange} className="input" placeholder="Ej: 612345678" pattern="[0-9]{9}" title="9 dígitos" maxLength={15} />
        </div>

        <div>
          <label className="label">Dirección</label>
          <input name="direccion" value={form.direccion} onChange={handleChange} className="input" placeholder="Ej: Calle Mayor 15, Madrid" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Guardando...' : '💾 Guardar Cliente'}
          </button>
          <Link href="/clientes" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
