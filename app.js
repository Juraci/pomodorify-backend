import express from 'express';
import Sequelize from 'sequelize';

const app = express();

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

let Goal = sequelize.define('goal', {
  description: {
    type: Sequelize.STRING,
    field: 'description'
  }
}, {
  freezeTableName: true
});

Goal.sync({force: true}).then(() => {
  return Goal.create({
    description: 'Lear sequelize'
  });
});

app.route('/')
  .get((req, res) => {
    Goal.findOne().then((goal) => {
      res.status(200).json(goal);
    });
  });

export default app;
