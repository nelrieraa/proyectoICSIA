'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

const CATEGORIAS = ['Motor', 'Frenos', 'Suspensión', 'Eléctrico', 'Carrocería', 'Otros'];

export default function EditarPiezaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    fetch(`/api/piezas/${id}`)
      .then((r) => r.json())
      .then((p) => setForm({ nombre: p.nombre, referencia: p.referencia, descripcion: p.descripcion || '', precio: p.precio, stock: p.stock, categoria: p.categoria }))
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
      const res = await fetch(`/api/piezas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, precio: Number(form.precio), stock: Number(form.stock) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar');
      router.push('/piezas');
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
        <Link href="/piezas" className="text-blue-600 hover:text-blue-700 text-sm">← Volver a Piezas</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Editar Pieza</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">⚠️ {error}</div>}

      {form && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="label">Nombre <span className="text-red-500">*</span></label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required className="input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Referencia <span className="text-red-500">*</span></label>
              <input name="referencia" value={form.referencia} onChange={handleChange} required className="input uppercase" />
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
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={2} className="input resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Precio (€) <span className="text-red-500">*</span></label>
              <input name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="label">Stock</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="input" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={guardando} className="btn-primary disabled:opacity-50">
              {guardando ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
            <Link href="/piezas" className="btn-secondary">Cancelar</Link>
          </div>
        </form>
      )}
    </div>
  );
}
