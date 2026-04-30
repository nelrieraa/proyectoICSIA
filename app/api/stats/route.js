import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Cliente, Vehiculo, Pieza, Reparacion } from '../../../lib/models/index';
import { connectMongoDB } from '../../../lib/mongodb';
import Diagnostico from '../../../lib/models/Diagnostico';

export async function GET() {
  try {
    const [
      totalClientes,
      totalVehiculos,
      reparacionesPendientes,
      reparacionesEnProceso,
      reparacionesCompletadas,
      piezasBajoStock,
      ultimasReparaciones,
    ] = await Promise.all([
      Cliente.count(),
      Vehiculo.count(),
      Reparacion.count({ where: { estado: 'Pendiente' } }),
      Reparacion.count({ where: { estado: 'En Proceso' } }),
      Reparacion.count({ where: { estado: 'Completada' } }),
      Pieza.count({ where: { stock: { [Op.lt]: 5 } } }),
      Reparacion.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
        include: [{ model: Vehiculo, as: 'vehiculo', attributes: ['marca', 'modelo', 'matricula'] }],
      }),
    ]);

    await connectMongoDB();
    const diagnosticosPendientes = await Diagnostico.countDocuments({ estado: 'Pendiente' });
    const diagnosticosCriticos = await Diagnostico.countDocuments({ prioridad: 'Crítica', estado: { $ne: 'Completado' } });

    return NextResponse.json({
      totalClientes,
      totalVehiculos,
      reparacionesPendientes,
      reparacionesEnProceso,
      reparacionesCompletadas,
      piezasBajoStock,
      diagnosticosPendientes,
      diagnosticosCriticos,
      ultimasReparaciones: ultimasReparaciones.map((r) => ({
        id: r.id,
        descripcion: r.descripcion,
        estado: r.estado,
        coste: r.coste,
        fecha_entrada: r.fecha_entrada,
        vehiculo: r.vehiculo,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
