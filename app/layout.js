import Sidebar from '../components/Sidebar';
import './globals.css';

export const metadata = {
  title: 'TallerTech — Gestión de Taller Mecánico',
  description: 'Sistema de gestión completo para talleres mecánicos. Clientes, vehículos, reparaciones y diagnósticos.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        <Sidebar />
        <main className="ml-64 min-h-screen">
          <div className="p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
