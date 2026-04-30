import Link from 'next/link';

export default function PageHeader({ titulo, descripcion, botonTexto, botonHref }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>
        {descripcion && <p className="text-gray-500 text-sm mt-1">{descripcion}</p>}
      </div>
      {botonTexto && botonHref && (
        <Link
          href={botonHref}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <span>+</span>
          {botonTexto}
        </Link>
      )}
    </div>
  );
}
