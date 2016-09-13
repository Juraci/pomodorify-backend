import express from 'express';
import cors from 'cors';
import Sequelize from 'sequelize';

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'PUT', 'POST', 'DELETE']
}

app.use(cors(corsOptions));

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

app.route('/goals')
  .get((req, res) => {
    res.status(200).json({
      data: [
        {
        type: 'goals',
        id: 1,
          attributes: {
            description: 'Goal from the backend'
          }
      }
      ]
    });
  });

export default app;
