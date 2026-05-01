import Link from 'next/link';

const sections = [
  { href: '/clientes', icon: '👥', title: 'Clientes', desc: 'Gestionar clientes del taller' },
  { href: '/vehiculos', icon: '🚗', title: 'Vehículos', desc: 'Inventario de vehículos' },
  { href: '/reparaciones', icon: '🔧', title: 'Reparaciones', desc: 'Seguimiento de reparaciones' },
  { href: '/piezas', icon: '🔩', title: 'Piezas', desc: 'Inventario de repuestos' },
];

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">TallerTech</h1>
        <p className="text-gray-500 mt-1">Sistema de gestión para taller mecánico</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <span className="text-4xl">{s.icon}</span>
              <h2 className="text-lg font-semibold text-gray-900 mt-3">{s.title}</h2>
              <p className="text-gray-500 text-sm mt-1">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
