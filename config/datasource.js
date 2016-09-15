import Sequelize from 'sequelize';

let database = null;

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

    sequelize.sync().done(() => {
      return database;
    });
  }

  return database;
}
