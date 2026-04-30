import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-8xl font-black text-gray-200 mb-4">404</div>
      <div className="text-5xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Recurso no encontrado</h2>
      <p className="text-gray-500 mb-6 max-w-sm">
        El registro que buscas no existe o ha sido eliminado del sistema.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Volver al Dashboard
      </Link>
    </div>
  );
}
