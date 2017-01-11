export default {
  database: 'pomodorify',
  username: 'postgres',
  password: 'postgres',
  params: {
    host: 'localhost',
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
