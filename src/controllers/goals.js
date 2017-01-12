import ApplicationController from './application';
import { serializer, deserializer } from '../serializers/goal';

class GoalsController extends ApplicationController {
  constructor(models) {
    super({ serializer, deserializer });
    this.Goal = models.Goal;
    this.Task = models.Task;
  }

  static defaultResponseOk(data) {
    return {
      status: 200,
      data,
    };
  }

  static notFound(error) {
    return {
      status: 404,
      data: {
        errors: [
          {
            detail: error.message,
          },
        ],
      },
    };
  }

  findAll() {
    return this.Goal.findAll({ include: [{ model: this.Task, as: 'tasks' }] })
      .then(goals => this.serialize(goals))
      .then(data => GoalsController.defaultResponseOk(data))
      .catch(err => GoalsController.notFound(err));
  }

  findById(id) {
    return this.Goal.find({ where: { id: parseInt(id, 10) }, include: [{ model: this.Task, as: 'tasks' }] })
      .then((goal) => {
        if (!goal) { throw new Error('goal not found'); }
        return this.serialize(goal);
      })
      .then(data => GoalsController.defaultResponseOk(data))
      .catch(err => GoalsController.notFound(err));
  }

  create(goal) {
    return this.deserialize(goal)
      .then(deserializedGoal => this.Goal.create(deserializedGoal))
      .then(record => ({
        status: 201,
        data: this.serialize(record),
      }))
      .catch(err => ({ data: err, status: 400 }));
  }

  deleteById(id) {
    return this.Goal.destroy({ where: { id: parseInt(id, 10) } })
      .then(() => ({ status: 204 }))
      .catch(err => ({ data: err, status: 400 }));
  }
}

export default GoalsController;
