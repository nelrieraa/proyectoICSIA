const estadoColors = {
  // Reparaciones
  Pendiente: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  'En Proceso': 'bg-blue-100 text-blue-800 border border-blue-200',
  Completada: 'bg-green-100 text-green-800 border border-green-200',
  Cancelada: 'bg-red-100 text-red-800 border border-red-200',
  // Vehículos
  Activo: 'bg-green-100 text-green-800 border border-green-200',
  'En Reparación': 'bg-orange-100 text-orange-800 border border-orange-200',
  Reparado: 'bg-blue-100 text-blue-800 border border-blue-200',
  'Dado de Baja': 'bg-gray-100 text-gray-600 border border-gray-200',
  // Diagnósticos - estado
  Completado: 'bg-green-100 text-green-800 border border-green-200',
  // Diagnósticos - prioridad
  Baja: 'bg-gray-100 text-gray-700 border border-gray-200',
  Media: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  Alta: 'bg-orange-100 text-orange-800 border border-orange-200',
  Crítica: 'bg-red-200 text-red-900 border border-red-300',
};

export default function Badge({ texto }) {
  const clases = estadoColors[texto] || 'bg-gray-100 text-gray-700 border border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${clases}`}>
      {texto}
    </span>
  );
}
