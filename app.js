import express from 'express';
import cors from 'cors';
import config from './config/config';
import datasource from './config/datasource';

const app = express();

app.use(cors(config.corsOptions));
app.config = config;
app.db = datasource(app);

app.route('/goals')
  .get((req, res) => {
    app.db.models.Goal.findAll().then((goals) => {
      let goalsObj = { data: [] };
      goals.forEach((goal) => {
        goalsObj.data.push(
          {
            type: 'goals',
            id: goals[0].id,
            attributes: {
              description: goals[0].description
            }
          }
        );
      });
      res.status(200).json(goalsObj);
    })
      .catch((err) => {
        console.log('Error: ', err);
        res.sendStatus(404);
      });
  });

export default app;
