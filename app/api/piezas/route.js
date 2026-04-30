import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Pieza } from '@/lib/models/index';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const buscar = searchParams.get('buscar') || '';
    const categoria = searchParams.get('categoria') || '';
    const bajoStock = searchParams.get('bajoStock') === 'true';

    const where = {};
    if (buscar) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${buscar}%` } },
        { referencia: { [Op.like]: `%${buscar}%` } },
        { descripcion: { [Op.like]: `%${buscar}%` } },
      ];
    }
    if (categoria) where.categoria = categoria;
    if (bajoStock) where.stock = { [Op.lt]: 5 };

    const piezas = await Pieza.findAll({ where, order: [['nombre', 'ASC']] });
    return NextResponse.json(piezas);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, referencia, descripcion, precio, stock, categoria } = body;

    if (!nombre?.trim() || !referencia?.trim() || !categoria) {
      return NextResponse.json({ error: 'Nombre, referencia y categoría son obligatorios' }, { status: 400 });
    }

    if (precio === undefined || precio === null || Number(precio) < 0) {
      return NextResponse.json({ error: 'El precio debe ser un valor positivo' }, { status: 400 });
    }

    if (stock !== undefined && Number(stock) < 0) {
      return NextResponse.json({ error: 'El stock no puede ser negativo' }, { status: 400 });
    }

    const pieza = await Pieza.create({ nombre: nombre.trim(), referencia: referencia.trim().toUpperCase(), descripcion, precio: Number(precio), stock: Number(stock) || 0, categoria });
    return NextResponse.json(pieza, { status: 201 });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json({ error: 'Ya existe una pieza con esa referencia' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
