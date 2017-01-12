import ApplicationController from './application';
import { serializer, deserializer } from '../serializers/goal';

class GoalsController extends ApplicationController {
  constructor(models) {
    super({ serializer, deserializer });
    this.Goal = models.Goal;
    this.Task = models.Task;
  }

  findAll() {
    return this.Goal.findAll({ include: [{ model: this.Task, as: 'tasks' }] })
      .then(goals => this.serialize(goals))
      .then(data => ApplicationController.ok(data))
      .catch(err => ApplicationController.jsonApiError(500, err));
  }

  findById(id) {
    return this.Goal.find({ where: { id: parseInt(id, 10) }, include: [{ model: this.Task, as: 'tasks' }] })
      .then((goal) => {
        if (!goal) { throw new Error('goal not found'); }
        return this.serialize(goal);
      })
      .then(data => ApplicationController.ok(data))
      .catch(err => GoalsController.jsonApiError(404, err));
  }

  create(goal) {
    return this.deserialize(goal)
      .then(deserializedGoal => this.Goal.create(deserializedGoal))
      .then(record => this.serialize(record))
      .then(serializedGoal => ApplicationController.created(serializedGoal))
      .catch(err => ApplicationController.jsonApiError(400, err));
  }

  deleteById(id) {
    return this.Goal.destroy({ where: { id: parseInt(id, 10) } })
      .then(() => ApplicationController.noContent())
      .catch(err => ApplicationController.jsonApiError(500, err));
  }
}

export default GoalsController;
