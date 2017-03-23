const app = require('./build/app.js').default;
const resilientStart = require('./resilientStart');

const port = process.env.PORT || 3000;

const appInitializer = (app) => {
  return app.datasource.sequelize.sync()
    .then(() => {
      return app.listen(port, () => {
        console.log(`Magic on port ${port}`);
      });
    });
};

resilientStart({
  app,
  port,
  appInitializer,
  retryTime: 3000,
  retryOnError: 'SequelizeConnection'
});
