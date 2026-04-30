import { DataTypes } from 'sequelize';
import sequelize from '../mysql.js';

const Reparacion =
  sequelize.models.Reparacion ||
  sequelize.define(
    'Reparacion',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_vehiculo: { type: DataTypes.INTEGER, allowNull: false },
      id_pieza: { type: DataTypes.INTEGER, allowNull: true },
      fecha_entrada: { type: DataTypes.DATEONLY, allowNull: false },
      fecha_salida: { type: DataTypes.DATEONLY, allowNull: true },
      descripcion: { type: DataTypes.TEXT, allowNull: false },
      coste: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
      estado: {
        type: DataTypes.ENUM('Pendiente', 'En Proceso', 'Completada', 'Cancelada'),
        defaultValue: 'Pendiente',
      },
    },
    {
      tableName: 'reparaciones',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

export default Reparacion;
