-- ============================================================
-- TallerTech — Script de creación y carga inicial (MySQL)
-- Ejecutar en: PlanetScale / Railway / AWS RDS
-- ============================================================

CREATE DATABASE IF NOT EXISTS tallertech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tallertech;

-- ----------------------------------------
-- Tabla: clientes
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS clientes (
  id          INT           PRIMARY KEY AUTO_INCREMENT,
  nombre      VARCHAR(50)   NOT NULL,
  apellidos   VARCHAR(100)  NOT NULL,
  email       VARCHAR(100)  UNIQUE,
  telefono    VARCHAR(20),
  direccion   VARCHAR(200),
  dni         VARCHAR(20)   UNIQUE,
  created_at  DATETIME      DEFAULT NOW()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------
-- Tabla: vehiculos  (FK → clientes)
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS vehiculos (
  id          INT           PRIMARY KEY AUTO_INCREMENT,
  id_cliente  INT           NOT NULL,
  marca       VARCHAR(50)   NOT NULL,
  modelo      VARCHAR(50)   NOT NULL,
  matricula   VARCHAR(20)   NOT NULL UNIQUE,
  anio        INT,
  color       VARCHAR(30),
  estado      ENUM('Activo','En Reparación','Reparado','Dado de Baja') DEFAULT 'Activo',
  created_at  DATETIME      DEFAULT NOW(),
  CONSTRAINT fk_vehiculo_cliente
    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------
-- Tabla: piezas
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS piezas (
  id          INT             PRIMARY KEY AUTO_INCREMENT,
  nombre      VARCHAR(100)    NOT NULL,
  referencia  VARCHAR(50)     NOT NULL UNIQUE,
  descripcion TEXT,
  precio      DECIMAL(10,2)   NOT NULL CHECK (precio >= 0),
  stock       INT             DEFAULT 0 CHECK (stock >= 0),
  categoria   ENUM('Motor','Frenos','Suspensión','Eléctrico','Carrocería','Otros') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------
-- Tabla: reparaciones  (FK → vehiculos, piezas)
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS reparaciones (
  id            INT           PRIMARY KEY AUTO_INCREMENT,
  id_vehiculo   INT           NOT NULL,
  id_pieza      INT,
  fecha_entrada DATE          NOT NULL,
  fecha_salida  DATE,
  descripcion   TEXT          NOT NULL,
  coste         DECIMAL(10,2) DEFAULT 0.00,
  estado        ENUM('Pendiente','En Proceso','Completada','Cancelada') DEFAULT 'Pendiente',
  created_at    DATETIME      DEFAULT NOW(),
  CONSTRAINT fk_rep_vehiculo
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id) ON DELETE CASCADE,
  CONSTRAINT fk_rep_pieza
    FOREIGN KEY (id_pieza)    REFERENCES piezas(id)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Clientes
INSERT INTO clientes (nombre, apellidos, email, telefono, direccion, dni) VALUES
('Carlos',   'García López',      'carlos.garcia@email.com',   '612345678', 'Calle Mayor 15, Madrid',       '12345678A'),
('María',    'Martínez Ruiz',     'maria.martinez@email.com',  '623456789', 'Avenida Libertad 42, Barcelona','23456789B'),
('Antonio',  'Sánchez Pérez',     'antonio.sanchez@email.com', '634567890', 'Plaza España 8, Valencia',      '34567890C'),
('Laura',    'González Díaz',     'laura.gonzalez@email.com',  '645678901', 'Calle Rosales 5, Sevilla',      '45678901D'),
('Pedro',    'Fernández Torres',  'pedro.fernandez@email.com', '656789012', 'Gran Vía 120, Bilbao',          '56789012E');

-- Vehículos
INSERT INTO vehiculos (id_cliente, marca, modelo, matricula, anio, color, estado) VALUES
(1, 'Toyota',     'Corolla', '1234-ABC', 2019, 'Blanco',   'Activo'),
(1, 'Ford',       'Focus',   '5678-DEF', 2017, 'Rojo',     'En Reparación'),
(2, 'BMW',        'Serie 3', '9012-GHI', 2021, 'Negro',    'Activo'),
(3, 'Seat',       'León',    '3456-JKL', 2018, 'Gris',     'En Reparación'),
(4, 'Volkswagen', 'Golf',    '7890-MNO', 2020, 'Azul',     'Activo'),
(4, 'Renault',    'Megane',  '2345-PQR', 2016, 'Plata',    'Reparado'),
(5, 'Honda',      'Civic',   '6789-STU', 2022, 'Blanco',   'Activo'),
(5, 'Mazda',      'CX-5',    '0123-VWX', 2019, 'Rojo',     'En Reparación');

-- Piezas
INSERT INTO piezas (nombre, referencia, descripcion, precio, stock, categoria) VALUES
('Pastillas de freno delanteras', 'FR-001', 'Pastillas de freno para eje delantero',        45.99,  15, 'Frenos'),
('Disco de freno delantero',      'FR-002', 'Disco de freno ventilado 280mm',               89.50,   8, 'Frenos'),
('Filtro de aceite',              'MO-001', 'Filtro de aceite estándar',                    12.99,  25, 'Motor'),
('Aceite motor 5W30 1L',          'MO-002', 'Aceite sintético 5W30 1 litro',                 8.50,  40, 'Motor'),
('Amortiguador delantero',        'SU-001', 'Amortiguador de gas delantero',               125.00,   4, 'Suspensión'),
('Batería 12V 60Ah',              'EL-001', 'Batería de arranque estándar 12V 60Ah',        95.00,   6, 'Eléctrico'),
('Alternador remanufacturado',    'EL-002', 'Alternador remanufacturado 90A',              185.00,   3, 'Eléctrico'),
('Parachoques delantero',         'CA-001', 'Parachoques de plástico sin pintar',          150.00,   2, 'Carrocería'),
('Kit correa de distribución',    'MO-003', 'Kit completo correa distribución + tensor',    78.99,   5, 'Motor'),
('Bujías de iridio (pack 4)',     'MO-004', 'Bujías de iridio alta duración pack 4 uds.',  32.50,  20, 'Motor');

-- Reparaciones
INSERT INTO reparaciones (id_vehiculo, id_pieza, fecha_entrada, fecha_salida, descripcion, coste, estado) VALUES
(2, 1, '2025-01-10', NULL,         'Sustitución de pastillas de freno delanteras. El cliente reporta ruido al frenar.',           120.00, 'En Proceso'),
(4, 5, '2025-01-12', NULL,         'Cambio de amortiguadores delanteros. Vehículo con exceso de vibración en marcha.',            350.00, 'En Proceso'),
(1, 3, '2024-12-15', '2024-12-16', 'Cambio de aceite y filtro. Mantenimiento rutinario programado.',                              65.00, 'Completada'),
(6, 9, '2024-11-20', '2024-11-25', 'Sustitución de correa de distribución. Kilometraje de cambio superado.',                     220.00, 'Completada'),
(8, 2, '2025-01-14', NULL,         'Cambio de discos y pastillas de freno. Desgaste extremo, vehículo peligroso.',               280.00, 'Pendiente'),
(3, 6, '2024-12-28', '2024-12-29', 'Cambio de batería. El vehículo no arrancaba por batería descargada.',                        110.00, 'Completada'),
(5, 7, '2025-01-05', '2025-01-08', 'Reparación de alternador. Luz de batería en cuadro. Motor no cargaba batería.',              200.00, 'Completada'),
(7, 4, '2025-01-11', NULL,         'Cambio de aceite motor. Revisión anual del vehículo.',                                        45.00, 'Pendiente');
