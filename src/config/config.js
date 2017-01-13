export default {
  database: 'pomodorify',
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASS || 'postgres',
  params: {
    host: process.env.DATABASE_URL || 'localhost',
    dialect: 'postgres',
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
