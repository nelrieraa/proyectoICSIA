'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Error de la aplicación:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Algo ha salido mal</h2>
      <p className="text-gray-500 mb-2 max-w-md">
        Se ha producido un error inesperado. Puede ser un problema de conexión con la base de datos.
      </p>
      <p className="text-red-500 text-sm mb-6 font-mono bg-red-50 px-4 py-2 rounded-lg max-w-md break-all">
        {error?.message || 'Error desconocido'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          Ir al Dashboard
        </Link>
      </div>
    </div>
  );
}
