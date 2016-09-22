import express from 'express';
import bodyParser from 'body-parser';

const router = express.Router();
const jsonParser = bodyParser.json();

export default (datasource) => {
  const Goal = datasource.models.Goal;

  router.route('/')
    .get((req, res) => {
      Goal.findAll()
        .then((goals) => {
          let goalsObj = { data: [] };
          goals.forEach((goal) => {
            goalsObj.data.push(
              {
                type: 'goals',
                id: goal.id,
                attributes: {
                  description: goal.description
                }
              }
            );
          });
          res.status(200).json(goalsObj);
        })
        .catch((err) => {
          res.sendStatus(404);
        });
    })
    .post(jsonParser, (req, res) => {
      let goal = req.body.data;
      Goal.create({ description: goal.attributes.description })
        .then(() => {
          res.sendStatus(204);
        })
        .catch((err) => {
          console.log(err);
        });
    });

  return router;
};
