import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Cliente, Vehiculo, Pieza, Reparacion } from '@/lib/models/index';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const buscar = searchParams.get('buscar') || '';
    const estado = searchParams.get('estado') || '';

    const where = {};
    if (buscar) {
      where.descripcion = { [Op.like]: `%${buscar}%` };
    }
    if (estado) where.estado = estado;

    const reparaciones = await Reparacion.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Vehiculo,
          as: 'vehiculo',
          attributes: ['id', 'marca', 'modelo', 'matricula'],
          include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nombre', 'apellidos'] }],
        },
        { model: Pieza, as: 'pieza', attributes: ['id', 'nombre', 'referencia'] },
      ],
    });

    return NextResponse.json(reparaciones);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id_vehiculo, id_pieza, fecha_entrada, fecha_salida, descripcion, coste, estado } = body;

    if (!id_vehiculo || !fecha_entrada || !descripcion?.trim()) {
      return NextResponse.json({ error: 'Vehículo, fecha de entrada y descripción son obligatorios' }, { status: 400 });
    }

    if (coste !== undefined && Number(coste) < 0) {
      return NextResponse.json({ error: 'El coste no puede ser negativo' }, { status: 400 });
    }

    if (fecha_salida && fecha_salida < fecha_entrada) {
      return NextResponse.json({ error: 'La fecha de salida no puede ser anterior a la de entrada' }, { status: 400 });
    }

    const vehiculoExiste = await Vehiculo.findByPk(id_vehiculo);
    if (!vehiculoExiste) {
      return NextResponse.json({ error: 'El vehículo seleccionado no existe' }, { status: 400 });
    }

    const reparacion = await Reparacion.create({
      id_vehiculo,
      id_pieza: id_pieza || null,
      fecha_entrada,
      fecha_salida: fecha_salida || null,
      descripcion: descripcion.trim(),
      coste: Number(coste) || 0,
      estado: estado || 'Pendiente',
    });

    return NextResponse.json(reparacion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
