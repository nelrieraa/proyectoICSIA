import { DataTypes } from 'sequelize';
import sequelize from '../mysql.js';

const Cliente =
  sequelize.models.Cliente ||
  sequelize.define(
    'Cliente',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: DataTypes.STRING(50), allowNull: false, validate: { notEmpty: true } },
      apellidos: { type: DataTypes.STRING(100), allowNull: false },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        validate: { isEmail: true },
      },
      telefono: { type: DataTypes.STRING(20) },
      direccion: { type: DataTypes.STRING(200) },
      dni: { type: DataTypes.STRING(20), allowNull: true, unique: true },
    },
    {
      tableName: 'clientes',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

export default Cliente;
