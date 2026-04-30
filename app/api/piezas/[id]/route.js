import { NextResponse } from 'next/server';
import { Pieza } from '@/lib/models/index';

export async function GET(request, { params }) {
  try {
    const pieza = await Pieza.findByPk(params.id);
    if (!pieza) {
      return NextResponse.json({ error: 'Pieza no encontrada' }, { status: 404 });
    }
    return NextResponse.json(pieza);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const pieza = await Pieza.findByPk(params.id);
    if (!pieza) {
      return NextResponse.json({ error: 'Pieza no encontrada' }, { status: 404 });
    }

    const body = await request.json();
    const { nombre, referencia, descripcion, precio, stock, categoria } = body;

    if (!nombre?.trim() || !referencia?.trim() || !categoria) {
      return NextResponse.json({ error: 'Nombre, referencia y categoría son obligatorios' }, { status: 400 });
    }

    if (Number(precio) < 0) {
      return NextResponse.json({ error: 'El precio debe ser un valor positivo' }, { status: 400 });
    }

    await pieza.update({ nombre: nombre.trim(), referencia: referencia.trim().toUpperCase(), descripcion, precio: Number(precio), stock: Number(stock) || 0, categoria });
    return NextResponse.json(pieza);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Ya existe una pieza con esa referencia' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const pieza = await Pieza.findByPk(params.id);
    if (!pieza) {
      return NextResponse.json({ error: 'Pieza no encontrada' }, { status: 404 });
    }

    await pieza.destroy();
    return NextResponse.json({ mensaje: 'Pieza eliminada correctamente' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
