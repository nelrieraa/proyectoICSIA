import { Sequelize } from 'sequelize';

const DB_URL =
  process.env.MYSQL_URL ||
  `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT || 3306}/${process.env.MYSQL_DATABASE}`;

let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(DB_URL, {
    dialect: 'mysql',
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  });
} else {
  // En desarrollo reutilizamos la instancia para evitar problemas con hot-reload
  if (!global._sequelize) {
    global._sequelize = new Sequelize(DB_URL, {
      dialect: 'mysql',
      logging: false,
    });
  }
  sequelize = global._sequelize;
}

export default sequelize;
