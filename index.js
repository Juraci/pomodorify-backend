const app = require('./build/app.js').default;
const resilientStart = require('./resilientStart');

const port = process.env.PORT || 3000;

const appInitializer = (app) => {
  return app.datasource.sequelize.sync().then(() => app);
};

resilientStart({
  app,
  port,
  appInitializer,
  maxAttempts: 3,
  retryTime: 3000,
  retryOnError: 'SequelizeConnection'
});
