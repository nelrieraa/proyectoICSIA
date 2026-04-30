import { DataTypes } from 'sequelize';
import sequelize from '../mysql.js';

const Pieza =
  sequelize.models.Pieza ||
  sequelize.define(
    'Pieza',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: DataTypes.STRING(100), allowNull: false },
      referencia: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      descripcion: { type: DataTypes.TEXT },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 },
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 },
      },
      categoria: {
        type: DataTypes.ENUM('Motor', 'Frenos', 'Suspensión', 'Eléctrico', 'Carrocería', 'Otros'),
        allowNull: false,
      },
    },
    {
      tableName: 'piezas',
      timestamps: false,
    }
  );

export default Pieza;
