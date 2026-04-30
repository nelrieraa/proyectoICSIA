import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Diagnostico from '@/lib/models/Diagnostico';

export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const diagnostico = await Diagnostico.findById(params.id);

    if (!diagnostico) {
      return NextResponse.json({ error: 'Diagnóstico no encontrado' }, { status: 404 });
    }

    return NextResponse.json(diagnostico);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectMongoDB();

    const body = await request.json();
    const {
      id_reparacion_mysql,
      id_vehiculo_mysql,
      matricula,
      tipo_diagnostico,
      descripcion_tecnica,
      estado,
      prioridad,
      metadatos_tecnicos,
      notas_adicionales,
    } = body;

    if (!descripcion_tecnica?.trim()) {
      return NextResponse.json({ error: 'La descripción técnica es obligatoria' }, { status: 400 });
    }

    let metadatos = {};
    if (metadatos_tecnicos) {
      if (typeof metadatos_tecnicos === 'string') {
        try {
          metadatos = JSON.parse(metadatos_tecnicos);
        } catch {
          return NextResponse.json({ error: 'Los metadatos técnicos no tienen formato JSON válido' }, { status: 400 });
        }
      } else {
        metadatos = metadatos_tecnicos;
      }
    }

    const diagnostico = await Diagnostico.findByIdAndUpdate(
      params.id,
      {
        id_reparacion_mysql: id_reparacion_mysql ? Number(id_reparacion_mysql) : undefined,
        id_vehiculo_mysql: id_vehiculo_mysql ? Number(id_vehiculo_mysql) : undefined,
        matricula,
        tipo_diagnostico,
        descripcion_tecnica: descripcion_tecnica.trim(),
        estado,
        prioridad,
        metadatos_tecnicos: metadatos,
        notas_adicionales,
      },
      { new: true, runValidators: true }
    );

    if (!diagnostico) {
      return NextResponse.json({ error: 'Diagnóstico no encontrado' }, { status: 404 });
    }

    return NextResponse.json(diagnostico);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    const diagnostico = await Diagnostico.findByIdAndDelete(params.id);

    if (!diagnostico) {
      return NextResponse.json({ error: 'Diagnóstico no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ mensaje: 'Diagnóstico eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
