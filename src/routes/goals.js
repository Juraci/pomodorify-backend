import express from 'express';
import bodyParser from 'body-parser';
import GoalsController from '../controllers/goals';

const router = express.Router();
const jsonParser = bodyParser.json();

export default (datasource) => {
  const goalsController = new GoalsController(datasource.models);

  router.route('/')
    .get((req, res) => {
      goalsController.findAll(req.query)
        .then(result => res.status(result.status).json(result.data));
    })
    .post(jsonParser, (req, res) => {
      goalsController.create(req.body)
        .then(result => res.status(result.status).json(result.data));
    });

  router.route('/:id')
    .get((req, res) => {
      goalsController.findById(req.params.id)
        .then(result => res.status(result.status).json(result.data));
    })
    .delete((req, res) => {
      goalsController.deleteById(req.params.id)
        .then(result => res.status(result.status).json(result.data));
    })
    .patch(jsonParser, (req, res) => {
      goalsController.updateById(req.params.id, req.body)
        .then(result => res.status(result.status).json(result.data));
    });

  return router;
};
