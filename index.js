import app from './app.js';

app.db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
});
