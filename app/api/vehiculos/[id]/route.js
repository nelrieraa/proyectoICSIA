import { NextResponse } from 'next/server';
import { Cliente, Vehiculo, Pieza, Reparacion } from '@/lib/models/index';

export async function GET(request, { params }) {
  try {
    const vehiculo = await Vehiculo.findByPk(params.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        {
          model: Reparacion,
          as: 'reparaciones',
          include: [{ model: Pieza, as: 'pieza', attributes: ['id', 'nombre', 'referencia'] }],
          order: [['created_at', 'DESC']],
        },
      ],
    });

    if (!vehiculo) {
      return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    }

    return NextResponse.json(vehiculo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const vehiculo = await Vehiculo.findByPk(params.id);
    if (!vehiculo) {
      return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { id_cliente, marca, modelo, matricula, anio, color, estado } = body;

    if (!id_cliente || !marca?.trim() || !modelo?.trim() || !matricula?.trim()) {
      return NextResponse.json({ error: 'Cliente, marca, modelo y matrícula son obligatorios' }, { status: 400 });
    }

    await vehiculo.update({ id_cliente, marca: marca.trim(), modelo: modelo.trim(), matricula: matricula.trim().toUpperCase(), anio, color, estado });
    return NextResponse.json(vehiculo);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Ya existe un vehículo con esa matrícula' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const vehiculo = await Vehiculo.findByPk(params.id);
    if (!vehiculo) {
      return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    }

    await vehiculo.destroy();
    return NextResponse.json({ mensaje: 'Vehículo eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
