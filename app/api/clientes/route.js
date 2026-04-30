import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Cliente, Vehiculo } from '@/lib/models/index';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const buscar = searchParams.get('buscar') || '';

    const where = {};
    if (buscar) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${buscar}%` } },
        { apellidos: { [Op.like]: `%${buscar}%` } },
        { email: { [Op.like]: `%${buscar}%` } },
        { dni: { [Op.like]: `%${buscar}%` } },
        { telefono: { [Op.like]: `%${buscar}%` } },
      ];
    }

    const clientes = await Cliente.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [{ model: Vehiculo, as: 'vehiculos', attributes: ['id', 'matricula', 'estado'] }],
    });

    return NextResponse.json(clientes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, apellidos, email, telefono, direccion, dni } = body;

    if (!nombre?.trim() || !apellidos?.trim()) {
      return NextResponse.json({ error: 'El nombre y apellidos son obligatorios' }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'El formato del email no es válido' }, { status: 400 });
    }

    const cliente = await Cliente.create({ nombre: nombre.trim(), apellidos: apellidos.trim(), email: email || null, telefono, direccion, dni: dni || null });
    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Ya existe un cliente con ese email o DNI' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
