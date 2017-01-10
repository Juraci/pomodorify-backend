import express from 'express';
import bodyParser from 'body-parser';
import TasksController from '../controllers/tasks';

const router = express.Router();
const jsonParser = bodyParser.json();

export default (datasource) => {
  const Task = datasource.models.Task;
  const tasksController = new TasksController(Task);

  router.route('/')
    .get((req, res) => {
      tasksController.findAll()
        .then((result) => {
          res.status(result.status).json(result.data);
        });
    })
    .post(jsonParser, (req, res) => {
      tasksController.create(req.body)
        .then((result) => {
          res.status(result.status).json(result.data);
        });
    });

  router.route('/:id')
    .get((req, res) => {
      tasksController.findById(req.params.id)
      .then(result => res.status(result.status).json(result.data));
    });

  return router;
}
