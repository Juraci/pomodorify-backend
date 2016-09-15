import express from 'express';
import cors from 'cors';
import config from './config/config';
import datasource from './config/datasource';

const app = express();

app.use(cors(config.corsOptions));

app.config = config;

let db = datasource(app);

let Goal = db.sequelize.define('goal', {
  description: {
    type: db.Sequelize.STRING,
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
