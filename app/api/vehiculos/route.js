import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Cliente, Vehiculo } from '@/lib/models/index';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const buscar = searchParams.get('buscar') || '';
    const estado = searchParams.get('estado') || '';

    const where = {};
    if (buscar) {
      where[Op.or] = [
        { matricula: { [Op.like]: `%${buscar}%` } },
        { marca: { [Op.like]: `%${buscar}%` } },
        { modelo: { [Op.like]: `%${buscar}%` } },
      ];
    }
    if (estado) where.estado = estado;

    const vehiculos = await Vehiculo.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'apellidos'] }],
    });

    return NextResponse.json(vehiculos);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id_cliente, marca, modelo, matricula, anio, color, estado } = body;

    if (!id_cliente || !marca?.trim() || !modelo?.trim() || !matricula?.trim()) {
      return NextResponse.json({ error: 'Cliente, marca, modelo y matrícula son obligatorios' }, { status: 400 });
    }

    if (anio && (anio < 1900 || anio > new Date().getFullYear() + 1)) {
      return NextResponse.json({ error: 'El año del vehículo no es válido' }, { status: 400 });
    }

    const clienteExiste = await Cliente.findByPk(id_cliente);
    if (!clienteExiste) {
      return NextResponse.json({ error: 'El cliente seleccionado no existe' }, { status: 400 });
    }

    const vehiculo = await Vehiculo.create({ id_cliente, marca: marca.trim(), modelo: modelo.trim(), matricula: matricula.trim().toUpperCase(), anio, color, estado: estado || 'Activo' });
    return NextResponse.json(vehiculo, { status: 201 });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Ya existe un vehículo con esa matrícula' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
