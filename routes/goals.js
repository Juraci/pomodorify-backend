import express from 'express';
import bodyParser from 'body-parser';
import GoalsController from '../controllers/goals';

const router = express.Router();
const jsonParser = bodyParser.json();

export default (datasource) => {
  const Goal = datasource.models.Goal;
  const goalsController = new GoalsController(Goal);

  router.route('/')
    .get((req, res) => {
      goalsController.findAll()
        .then((result) => {
          res.status(result.status).json(result.data);
        });
    })
    .post(jsonParser, (req, res) => {
      let goal = req.body.data.attributes;
      goalsController.create(goal)
        .then((result) => {
          res.sendStatus(result.status);
        });
    });

  return router;
};
