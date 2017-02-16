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
    if ('user' in data) {
      return { description: data.description, userId: data.user.id };
    }
    return { description: data.description };
  }

  create(goal) {
    return super.create(goal, GoalsController.mountGoalObject);
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
