import Cliente from './Cliente.js';
import Vehiculo from './Vehiculo.js';
import Pieza from './Pieza.js';
import Reparacion from './Reparacion.js';

if (!Cliente.associations?.vehiculos) {
  Cliente.hasMany(Vehiculo, { foreignKey: 'id_cliente', as: 'vehiculos', onDelete: 'CASCADE' });
  Vehiculo.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

  Vehiculo.hasMany(Reparacion, { foreignKey: 'id_vehiculo', as: 'reparaciones', onDelete: 'CASCADE' });
  Reparacion.belongsTo(Vehiculo, { foreignKey: 'id_vehiculo', as: 'vehiculo' });

  Pieza.hasMany(Reparacion, { foreignKey: 'id_pieza', as: 'reparaciones', onDelete: 'SET NULL' });
  Reparacion.belongsTo(Pieza, { foreignKey: 'id_pieza', as: 'pieza' });
}

export { Cliente, Vehiculo, Pieza, Reparacion };
