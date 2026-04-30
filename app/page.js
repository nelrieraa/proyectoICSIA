'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Badge from '../components/Badge';
import LoadingSpinner from '../components/LoadingSpinner';

function StatCard({ icono, titulo, valor, subtitulo, color, href }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  const card = (
    <div className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${colorMap[color] || colorMap.blue}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icono}</span>
        <span className="text-3xl font-bold text-gray-900">{valor}</span>
      </div>
      <p className="text-sm font-semibold text-gray-700">{titulo}</p>
      {subtitulo && <p className="text-xs text-gray-500 mt-0.5">{subtitulo}</p>}
    </div>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function cargarStats() {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error('No se pudo conectar con la base de datos');
        const data = await res.json();
        if (mounted) setStats(data);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    cargarStats();
    return () => { mounted = false; };
  }, []);

  if (loading) return <LoadingSpinner texto="Cargando dashboard..." />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 text-lg font-semibold mb-1">⚠️ Error de conexión</p>
        <p className="text-red-500 text-sm">{error}</p>
        <p className="text-gray-500 text-xs mt-2">Comprueba que las variables de entorno MYSQL_URL y MONGODB_URI están configuradas.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen general del taller — {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icono="👥" titulo="Clientes" valor={stats.totalClientes} subtitulo="Total registrados" color="blue" href="/clientes" />
        <StatCard icono="🚗" titulo="Vehículos" valor={stats.totalVehiculos} subtitulo="Total en sistema" color="purple" href="/vehiculos" />
        <StatCard icono="⏳" titulo="Pendientes" valor={stats.reparacionesPendientes} subtitulo="Reparaciones sin iniciar" color="yellow" href="/reparaciones?estado=Pendiente" />
        <StatCard icono="🔧" titulo="En proceso" valor={stats.reparacionesEnProceso} subtitulo="Reparaciones activas" color="blue" href="/reparaciones?estado=En+Proceso" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icono="✅" titulo="Completadas" valor={stats.reparacionesCompletadas} subtitulo="Reparaciones finalizadas" color="green" href="/reparaciones?estado=Completada" />
        <StatCard icono="🔩" titulo="Stock bajo" valor={stats.piezasBajoStock} subtitulo="Piezas con stock < 5" color={stats.piezasBajoStock > 0 ? 'red' : 'green'} href="/piezas?bajoStock=true" />
        <StatCard icono="📋" titulo="Diagnósticos" valor={stats.diagnosticosPendientes} subtitulo="Pendientes de revisar" color="orange" href="/diagnosticos?estado=Pendiente" />
        <StatCard icono="🚨" titulo="Críticos" valor={stats.diagnosticosCriticos} subtitulo="Diagnósticos críticos abiertos" color={stats.diagnosticosCriticos > 0 ? 'red' : 'green'} href="/diagnosticos?prioridad=Crítica" />
      </div>

      {/* Alertas */}
      {(stats.piezasBajoStock > 0 || stats.diagnosticosCriticos > 0) && (
        <div className="mb-8 space-y-3">
          {stats.piezasBajoStock > 0 && (
            <Link href="/piezas?bajoStock=true">
              <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 hover:bg-yellow-100 transition-colors">
                <span className="text-yellow-500 text-xl">⚠️</span>
                <div>
                  <p className="text-yellow-800 font-semibold text-sm">Alerta de stock bajo</p>
                  <p className="text-yellow-700 text-xs">{stats.piezasBajoStock} pieza(s) con stock inferior a 5 unidades. Considera reabastecer.</p>
                </div>
              </div>
            </Link>
          )}
          {stats.diagnosticosCriticos > 0 && (
            <Link href="/diagnosticos?prioridad=Crítica">
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 hover:bg-red-100 transition-colors">
                <span className="text-red-500 text-xl">🚨</span>
                <div>
                  <p className="text-red-800 font-semibold text-sm">Diagnósticos críticos sin resolver</p>
                  <p className="text-red-700 text-xs">{stats.diagnosticosCriticos} diagnóstico(s) con prioridad CRÍTICA pendiente(s) de atención urgente.</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Últimas reparaciones */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Últimas reparaciones</h2>
          <Link href="/reparaciones" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Ver todas →
          </Link>
        </div>
        {stats.ultimasReparaciones.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-4xl mb-2">🔧</p>
            <p>No hay reparaciones registradas</p>
            <Link href="/reparaciones/nuevo" className="mt-3 inline-block text-blue-600 text-sm hover:underline">Crear primera reparación</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.ultimasReparaciones.map((r) => (
              <Link key={r.id} href={`/reparaciones/${r.id}`}>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.descripcion}</p>
                    {r.vehiculo && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {r.vehiculo.marca} {r.vehiculo.modelo} — {r.vehiculo.matricula}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <Badge texto={r.estado} />
                    <span className="text-sm font-semibold text-gray-700">{Number(r.coste).toFixed(2)}€</span>
                    <span className="text-xs text-gray-400">{new Date(r.fecha_entrada).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
