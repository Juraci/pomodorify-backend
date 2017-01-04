import Sequelize from 'sequelize';
import Goal from '../models/Goal';
import Task from '../models/Task';

let database = null;

const loadModels = (sequelize, DataType) => {
  let models = [];
  models['Goal'] = Goal(sequelize, DataType);
  models['Task'] = Task(sequelize, DataType);
  return models;
};

export default (app) => {
  if(!database) {
    const config = app.config,
      sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config.params
      );

    database = {
      sequelize,
      Sequelize,
      models: {}
    };

    database.models = loadModels(sequelize, Sequelize);
  }

  return database;
}
