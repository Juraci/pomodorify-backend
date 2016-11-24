const app = require('./build/app.js').default;

const port = 3000;
const connectionMaxAttempts = 3;
const connectionRetryTime = 1000;
let connectionAttempts = 0;

const startApp = () => {
  app.datasource.sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    if (err.name.match(/SequelizeConnection/) && connectionAttempts <= connectionMaxAttempts) {
      connectionAttempts++;

      console.log('>>> db connection failed, attempt: ', connectionAttempts);

      setTimeout(() => {
        startApp();
      }, connectionRetryTime);
    }

    console.log('>> Promise rejection: ', err.name);
  });
};

startApp();
