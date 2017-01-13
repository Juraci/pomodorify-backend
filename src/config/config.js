export default {
  database: process.env.DB_NAME || 'pomodorify',
  username: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  params: {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    dialectOptions: {
      ssl: !(process.env.NODE_ENV === 'test'),
    },
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    logging: false,
  },
  corsOptions: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
  },
};
