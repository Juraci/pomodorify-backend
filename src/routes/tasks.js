import express from 'express';
import TasksController from '../controllers/tasks';

const router = express.Router();

export default ({ datasource, jsonParser }) => {
  const models = datasource.models;
  const tasksController = new TasksController(models);

  router.route('/')
    .get((req, res) => {
      tasksController.findAll()
        .then(result => res.status(result.status).json(result.data));
    })
    .post(jsonParser, (req, res) => {
      tasksController.create(req.body)
        .then(result => res.status(result.status).json(result.data));
    });

  router.route('/:id')
    .get((req, res) => {
      tasksController.findById(req.params.id)
      .then(result => res.status(result.status).json(result.data));
    })
    .patch(jsonParser, (req, res) => {
      tasksController.updateById(req.params.id, req.body)
        .then(result => res.status(result.status).json(result.data));
    });

  return router;
};
