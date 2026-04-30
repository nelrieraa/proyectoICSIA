import { NextResponse } from 'next/server';
import { Cliente, Vehiculo, Reparacion } from '@/lib/models/index';

export async function GET(request, { params }) {
  try {
    const cliente = await Cliente.findByPk(params.id, {
      include: [
        {
          model: Vehiculo,
          as: 'vehiculos',
          include: [{ model: Reparacion, as: 'reparaciones', attributes: ['id', 'estado', 'fecha_entrada', 'coste'] }],
        },
      ],
    });

    if (!cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    return NextResponse.json(cliente);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const cliente = await Cliente.findByPk(params.id);
    if (!cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { nombre, apellidos, email, telefono, direccion, dni } = body;

    if (!nombre?.trim() || !apellidos?.trim()) {
      return NextResponse.json({ error: 'El nombre y apellidos son obligatorios' }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'El formato del email no es válido' }, { status: 400 });
    }

    await cliente.update({ nombre: nombre.trim(), apellidos: apellidos.trim(), email: email || null, telefono, direccion, dni: dni || null });
    return NextResponse.json(cliente);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Ya existe un cliente con ese email o DNI' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const cliente = await Cliente.findByPk(params.id);
    if (!cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    await cliente.destroy();
    return NextResponse.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
