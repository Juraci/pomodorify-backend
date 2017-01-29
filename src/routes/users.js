import express from 'express';
import bodyParser from 'body-parser';
import UsersController from '../controllers/users';

const router = express.Router();
const jsonParser = bodyParser.json();

export default (datasource) => {
  const usersController = new UsersController(datasource.models);

  router.route('/')
    .get((req, res) => {
      usersController.findAll()
        .then(result => res.status(result.status).json(result.data));
    })
    .post(jsonParser, (req, res) => {
      usersController.create(req.body)
        .then(result => res.status(result.status).json(result.data));
    });

  router.route('/:id')
    .get((req, res) => {
      usersController.findById(req.params.id)
        .then(result => res.status(result.status).json(result.data));
    })
    .delete((req, res) => {
      usersController.deleteById(req.params.id)
        .then(result => res.status(result.status).json(result.data));
    })
    .patch(jsonParser, (req, res) => {
      usersController.updateById(req.params.id, req.body)
        .then(result => res.status(result.status).json(result.data));
    });

  return router;
};
