'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CATEGORIAS = ['Motor', 'Frenos', 'Suspensión', 'Eléctrico', 'Carrocería', 'Otros'];

export default function NuevaPiezaPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', referencia: '', descripcion: '', precio: '', stock: '0', categoria: 'Motor' });
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
      const res = await fetch('/api/piezas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, precio: Number(form.precio), stock: Number(form.stock) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear pieza');
      router.push('/piezas');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/piezas" className="text-blue-600 hover:text-blue-700 text-sm">← Volver a Piezas</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Nueva Pieza</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="label">Nombre <span className="text-red-500">*</span></label>
          <input name="nombre" value={form.nombre} onChange={handleChange} required className="input" placeholder="Ej: Pastillas de freno delanteras" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Referencia <span className="text-red-500">*</span></label>
            <input name="referencia" value={form.referencia} onChange={handleChange} required className="input uppercase" placeholder="Ej: FR-001" />
          </div>
          <div>
            <label className="label">Categoría <span className="text-red-500">*</span></label>
            <select name="categoria" value={form.categoria} onChange={handleChange} required className="input">
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={2} className="input resize-none" placeholder="Descripción opcional de la pieza..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Precio (€) <span className="text-red-500">*</span></label>
            <input name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handleChange} required className="input" placeholder="0.00" />
          </div>
          <div>
            <label className="label">Stock inicial</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="input" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Guardando...' : '💾 Guardar Pieza'}
          </button>
          <Link href="/piezas" className="btn-secondary">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
