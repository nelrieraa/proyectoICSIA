import { NextResponse } from 'next/server';
import { Cliente, Vehiculo, Pieza, Reparacion } from '@/lib/models/index';

export async function GET(request, { params }) {
  try {
    const reparacion = await Reparacion.findByPk(params.id, {
      include: [
        {
          model: Vehiculo,
          as: 'vehiculo',
          include: [{ model: Cliente, as: 'cliente' }],
        },
        { model: Pieza, as: 'pieza' },
      ],
    });

    if (!reparacion) {
      return NextResponse.json({ error: 'Reparación no encontrada' }, { status: 404 });
    }

    return NextResponse.json(reparacion);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const reparacion = await Reparacion.findByPk(params.id);
    if (!reparacion) {
      return NextResponse.json({ error: 'Reparación no encontrada' }, { status: 404 });
    }

    const body = await request.json();
    const { id_vehiculo, id_pieza, fecha_entrada, fecha_salida, descripcion, coste, estado } = body;

    if (!id_vehiculo || !fecha_entrada || !descripcion?.trim()) {
      return NextResponse.json({ error: 'Vehículo, fecha de entrada y descripción son obligatorios' }, { status: 400 });
    }

    if (fecha_salida && fecha_salida < fecha_entrada) {
      return NextResponse.json({ error: 'La fecha de salida no puede ser anterior a la de entrada' }, { status: 400 });
    }

    await reparacion.update({
      id_vehiculo,
      id_pieza: id_pieza || null,
      fecha_entrada,
      fecha_salida: fecha_salida || null,
      descripcion: descripcion.trim(),
      coste: Number(coste) || 0,
      estado,
    });

    return NextResponse.json(reparacion);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const reparacion = await Reparacion.findByPk(params.id);
    if (!reparacion) {
      return NextResponse.json({ error: 'Reparación no encontrada' }, { status: 404 });
    }

    await reparacion.destroy();
    return NextResponse.json({ mensaje: 'Reparación eliminada correctamente' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
