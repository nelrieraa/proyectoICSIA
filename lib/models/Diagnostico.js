import mongoose from 'mongoose';

const diagnosticoSchema = new mongoose.Schema(
  {
    id_reparacion_mysql: { type: Number },
    id_vehiculo_mysql: { type: Number },
    matricula: { type: String, trim: true },
    fecha: { type: Date, default: Date.now },
    tipo_diagnostico: {
      type: String,
      enum: ['Inicial', 'Revisión', 'Final', 'Urgente'],
      default: 'Inicial',
    },
    descripcion_tecnica: { type: String, required: [true, 'La descripción técnica es obligatoria'] },
    estado: {
      type: String,
      enum: ['Pendiente', 'En Proceso', 'Completado'],
      default: 'Pendiente',
    },
    prioridad: {
      type: String,
      enum: ['Baja', 'Media', 'Alta', 'Crítica'],
      default: 'Media',
    },
    // Campo flexible para metadatos técnicos variables (kilometraje, presión, códigos OBD, etc.)
    metadatos_tecnicos: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    notas_adicionales: { type: String },
  },
  {
    timestamps: { createdAt: 'fecha_creacion', updatedAt: false },
  }
);

const Diagnostico =
  mongoose.models.Diagnostico || mongoose.model('Diagnostico', diagnosticoSchema);

export default Diagnostico;
