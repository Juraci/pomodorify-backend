import ApplicationController from './application';
import GoalSerializer from '../serializers/goal';

class GoalsController extends ApplicationController {
  constructor(models) {
    const goalSerializer = new GoalSerializer();

    super({
      serializer: goalSerializer.buildSerializer(true),
      deserializer: GoalSerializer.buildDeserializer(),
      model: models.Goal,
      relations: [{ model: models.Task, as: 'tasks' }],
    });

    this.Goal = models.Goal;
    this.Task = models.Task;
  }

  static mountGoalObject(data) {
    let obj;
    if (Object.prototype.hasOwnProperty.call(data, 'user')) {
      obj = { description: data.description, userId: data.user.id };
    } else {
      obj = { description: data.description };
    }

    return obj;
  }

  create(goal) {
    return this.deserialize(goal)
      .then(deserializedGoal => GoalsController.mountGoalObject(deserializedGoal))
      .then(goalObject => this.Goal.create(goalObject))
      .then(record => this.serialize(record))
      .then(serializedGoal => GoalsController.created(serializedGoal))
      .catch(err => GoalsController.jsonApiError(400, err));
  }

  deleteById(id) {
    return this.Goal.destroy({ where: { id: parseInt(id, 10) } })
      .then((result) => {
        if (result !== 1) { throw new Error('resource not found'); }
      })
      .then(() => GoalsController.noContent())
      .catch(err => GoalsController.notFound(err));
  }
}

export default GoalsController;
