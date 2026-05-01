import Sidebar from '../components/Sidebar';
import './globals.css';

export const metadata = {
  title: 'TallerTech — Gestión de Taller Mecánico',
  description: 'Sistema de gestión para talleres mecánicos.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50">
        <Sidebar />
        <main className="md:ml-64 min-h-screen pt-14 md:pt-0">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
