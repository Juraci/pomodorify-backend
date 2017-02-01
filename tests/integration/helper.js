import request from 'supertest';
import chai from 'chai';
import app from '../../src/app';

global.app = app;
global.request = request(app);
global.expect = chai.expect;

global.destroyAll = (done) => {
  const Task = app.datasource.models.Task;
  const Goal = app.datasource.models.Goal;
  const User = app.datasource.models.User;

  app.datasource.sequelize.sync().then(() => {
    Task
      .destroy({ where: {} })
      .then(() => Goal.destroy({ where: {} }))
      .then(() => User.destroy({ where: {} }))
      .then(() => {
        done();
      });
  });
};
