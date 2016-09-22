import app from './app.js';

app.datasource.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
});
