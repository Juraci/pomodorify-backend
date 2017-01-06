import Sequelize from 'sequelize';
import Goal from '../models/Goal';
import Task from '../models/Task';

let database = null;

const loadModels = (sequelize, DataType) => {
  let models = [];
  models['Task'] = Task(sequelize, DataType);
  models['Goal'] = Goal(sequelize, DataType);
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
    Object.keys(database.models)
      .filter((m) => {
        return database.models[m].hasOwnProperty('associate');
      })
      .forEach((m) => {
        database.models[m].associate(database.models);
      });
  }

  return database;
}
