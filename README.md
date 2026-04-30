# TallerTech — Gestión de Taller Mecánico

Aplicación web full-stack desarrollada con **Next.js 14**, **MySQL (Sequelize)** y **MongoDB (Mongoose)** para la gestión completa de un taller mecánico.

---

## Descripción de la aplicación

TallerTech permite gestionar todas las operaciones de un taller mecánico:

- **Clientes**: registro completo con DNI, contacto y dirección.
- **Vehículos**: inventario de vehículos asociados a cada cliente, con seguimiento de estado.
- **Reparaciones**: seguimiento completo del ciclo de vida de cada reparación (pendiente → en proceso → completada).
- **Piezas**: inventario de repuestos con control de stock y alertas de reabastecimiento.
- **Diagnósticos** (MongoDB): logs técnicos flexibles con metadatos variables (códigos OBD, presiones, voltajes, etc.).

---

## Diseño de la Base de Datos MySQL

```
┌─────────────┐         ┌──────────────────┐
│  clientes   │ 1      N│    vehiculos      │
│─────────────│◄────────│──────────────────│
│ id (PK)     │         │ id (PK)          │
│ nombre      │         │ id_cliente (FK)  │
│ apellidos   │         │ marca            │
│ email       │         │ modelo           │
│ telefono    │         │ matricula        │
│ direccion   │         │ anio             │
│ dni         │         │ color            │
│ created_at  │         │ estado (ENUM)    │
└─────────────┘         │ created_at       │
                        └────────┬─────────┘
                                 │ 1
                                 │ N
                        ┌────────▼─────────┐        ┌─────────────────┐
                        │   reparaciones   │ N     1 │     piezas      │
                        │──────────────────│────────►│─────────────────│
                        │ id (PK)          │         │ id (PK)         │
                        │ id_vehiculo (FK) │         │ nombre          │
                        │ id_pieza (FK)    │         │ referencia      │
                        │ fecha_entrada    │         │ descripcion     │
                        │ fecha_salida     │         │ precio          │
                        │ descripcion      │         │ stock           │
                        │ coste            │         │ categoria(ENUM) │
                        │ estado (ENUM)    │         └─────────────────┘
                        │ created_at       │
                        └──────────────────┘
```

### Tipos ENUM

| Tabla | Campo | Valores |
|-------|-------|---------|
| vehiculos | estado | Activo, En Reparación, Reparado, Dado de Baja |
| piezas | categoria | Motor, Frenos, Suspensión, Eléctrico, Carrocería, Otros |
| reparaciones | estado | Pendiente, En Proceso, Completada, Cancelada |

---

## Diseño de la Colección MongoDB

```json
{
  "_id": "ObjectId (auto)",
  "id_reparacion_mysql": 1,
  "id_vehiculo_mysql": 2,
  "matricula": "5678-DEF",
  "fecha": "ISODate",
  "tipo_diagnostico": "Inicial | Revisión | Final | Urgente",
  "descripcion_tecnica": "String (texto largo del diagnóstico)",
  "estado": "Pendiente | En Proceso | Completado",
  "prioridad": "Baja | Media | Alta | Crítica",
  "metadatos_tecnicos": {
    "kilometraje": 85000,
    "presion_neumaticos": { "delantera_izq": 2.1, ... },
    "nivel_aceite": "OK",
    "codigo_error_obd": "C0035",
    "temperatura_frenos_c": 180
  },
  "notas_adicionales": "String (comentarios del técnico)",
  "fecha_creacion": "ISODate (automático)"
}
```

**Justificación del uso de MongoDB**: el campo `metadatos_tecnicos` es completamente variable —cada diagnóstico puede tener datos distintos según el tipo de avería (códigos OBD, presiones, voltajes, mediciones de frenos, etc.)—. Un esquema relacional rígido no puede modelar eficientemente este tipo de datos semiestructurados.

---

## Rutas de la aplicación

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/` | GET | Dashboard con estadísticas y alertas |
| `/clientes` | GET | Listado de clientes con búsqueda |
| `/clientes/nuevo` | GET | Formulario de alta de cliente |
| `/clientes/[id]` | GET | Ficha completa del cliente con sus vehículos |
| `/clientes/editar/[id]` | GET | Formulario de edición de cliente |
| `/vehiculos` | GET | Inventario de vehículos con filtros (estado, marca, búsqueda) |
| `/vehiculos/nuevo` | GET | Formulario de alta de vehículo |
| `/vehiculos/[id]` | GET | Ficha del vehículo con historial de reparaciones |
| `/vehiculos/editar/[id]` | GET | Formulario de edición de vehículo |
| `/reparaciones` | GET | Listado de reparaciones con filtros (estado, mes, búsqueda) |
| `/reparaciones/nuevo` | GET | Formulario de nueva reparación |
| `/reparaciones/[id]` | GET | Detalle de reparación con navegación a vehículo y cliente |
| `/reparaciones/editar/[id]` | GET | Formulario de edición de reparación |
| `/diagnosticos` | GET | Listado de diagnósticos MongoDB con filtros |
| `/diagnosticos/nuevo` | GET | Formulario de nuevo diagnóstico |
| `/diagnosticos/[id]` | GET | Detalle de diagnóstico con metadatos técnicos |
| `/diagnosticos/editar/[id]` | GET | Formulario de edición de diagnóstico |
| `/piezas` | GET | Inventario de piezas con filtros (categoría, bajo stock) |
| `/piezas/nuevo` | GET | Formulario de alta de pieza |
| `/piezas/editar/[id]` | GET | Formulario de edición de pieza |

### API REST

| Endpoint | Métodos | Descripción |
|----------|---------|-------------|
| `/api/clientes` | GET, POST | Listado y creación de clientes |
| `/api/clientes/[id]` | GET, PUT, DELETE | Consulta, edición y borrado de cliente |
| `/api/vehiculos` | GET, POST | Listado (con filtros) y creación |
| `/api/vehiculos/[id]` | GET, PUT, DELETE | Consulta, edición y borrado |
| `/api/piezas` | GET, POST | Listado (con filtros) y creación |
| `/api/piezas/[id]` | GET, PUT, DELETE | Consulta, edición y borrado |
| `/api/reparaciones` | GET, POST | Listado (con filtros) y creación |
| `/api/reparaciones/[id]` | GET, PUT, DELETE | Consulta, edición y borrado |
| `/api/diagnosticos` | GET, POST | Listado (MongoDB) y creación |
| `/api/diagnosticos/[id]` | GET, PUT, DELETE | Consulta, edición y borrado (MongoDB) |
| `/api/stats` | GET | Estadísticas para el dashboard |

---

## Tecnologías utilizadas

- **Next.js 14** (App Router)
- **React 18** (Client Components + API Routes)
- **Sequelize 6** — ORM para MySQL
- **Mongoose 8** — ODM para MongoDB
- **Tailwind CSS 3** — Estilos
- **MySQL 8** — Base de datos relacional
- **MongoDB Atlas** — Base de datos documental

---

## Funcionalidades destacadas

- ✅ **CRUD completo** sobre clientes, vehículos, piezas (MySQL) y diagnósticos (MongoDB)
- ✅ **3+ filtros combinados** en cada listado (búsqueda + estado + categoría/mes)
- ✅ **Navegación contextual** (desde vehículo → cliente, desde reparación → vehículo → cliente)
- ✅ **Dashboard** con contadores, alertas de stock bajo y diagnósticos críticos
- ✅ **Validación dual** (HTML5 en formularios + validación en servidor)
- ✅ **Manejo de errores** con try/catch y mensajes al usuario
- ✅ **Confirmación** antes de eliminar registros
- ✅ **error.js** y **not-found.js** personalizados
- ✅ **Sequelize** como ORM con asociaciones (hasMany, belongsTo)
- ✅ **Mongoose** como ODM con schema flexible (Mixed type)
- ✅ **API REST** completa con GET, POST, PUT, DELETE
