'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '🏠', exact: true },
  { href: '/clientes', label: 'Clientes', icon: '👥' },
  { href: '/vehiculos', label: 'Vehículos', icon: '🚗' },
  { href: '/reparaciones', label: 'Reparaciones', icon: '🔧' },
  { href: '/diagnosticos', label: 'Diagnósticos', icon: '📋' },
  { href: '/piezas', label: 'Piezas', icon: '🔩' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-50">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">🔧 TallerTech</h1>
        <p className="text-slate-400 text-sm mt-1">Gestión de Taller Mecánico</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs text-center">TallerTech v1.0 — 2DAW 2025</p>
      </div>
    </aside>
  );
}
