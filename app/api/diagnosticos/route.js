import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Diagnostico from '@/lib/models/Diagnostico';

export async function GET(request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const buscar = searchParams.get('buscar') || '';
    const estado = searchParams.get('estado') || '';
    const prioridad = searchParams.get('prioridad') || '';

    const filtro = {};
    if (buscar) {
      filtro.$or = [
        { descripcion_tecnica: { $regex: buscar, $options: 'i' } },
        { matricula: { $regex: buscar, $options: 'i' } },
        { notas_adicionales: { $regex: buscar, $options: 'i' } },
      ];
    }
    if (estado) filtro.estado = estado;
    if (prioridad) filtro.prioridad = prioridad;

    const diagnosticos = await Diagnostico.find(filtro).sort({ fecha_creacion: -1 });
    return NextResponse.json(diagnosticos);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
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

    // Procesar metadatos_tecnicos: puede venir como string JSON o como objeto
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

    const diagnostico = await Diagnostico.create({
      id_reparacion_mysql: id_reparacion_mysql ? Number(id_reparacion_mysql) : undefined,
      id_vehiculo_mysql: id_vehiculo_mysql ? Number(id_vehiculo_mysql) : undefined,
      matricula,
      tipo_diagnostico: tipo_diagnostico || 'Inicial',
      descripcion_tecnica: descripcion_tecnica.trim(),
      estado: estado || 'Pendiente',
      prioridad: prioridad || 'Media',
      metadatos_tecnicos: metadatos,
      notas_adicionales,
    });

    return NextResponse.json(diagnostico, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
