'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '🏠', exact: true },
  { href: '/clientes', label: 'Clientes', icon: '👥' },
  { href: '/vehiculos', label: 'Vehículos', icon: '🚗' },
  { href: '/reparaciones', label: 'Reparaciones', icon: '🔧' },
  { href: '/piezas', label: 'Piezas', icon: '🔩' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white flex items-center justify-between px-4 py-3">
        <span className="font-bold text-lg">🔧 TallerTech</span>
        <button onClick={() => setOpen(!open)} className="text-white text-2xl leading-none px-2">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-50 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
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
                    onClick={() => setOpen(false)}
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
    </>
  );
}
