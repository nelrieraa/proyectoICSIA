import { DataTypes } from 'sequelize';
import sequelize from '../mysql.js';

const Vehiculo =
  sequelize.models.Vehiculo ||
  sequelize.define(
    'Vehiculo',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      id_cliente: { type: DataTypes.INTEGER, allowNull: false },
      marca: { type: DataTypes.STRING(50), allowNull: false },
      modelo: { type: DataTypes.STRING(50), allowNull: false },
      matricula: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      anio: { type: DataTypes.INTEGER },
      color: { type: DataTypes.STRING(30) },
      estado: {
        type: DataTypes.ENUM('Activo', 'En Reparación', 'Reparado', 'Dado de Baja'),
        defaultValue: 'Activo',
      },
    },
    {
      tableName: 'vehiculos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

export default Vehiculo;
