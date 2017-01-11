import GoalSerializer from '../serializers/goal';

class GoalsController {
  constructor(models) {
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

  static serialize(data) {
    return GoalSerializer.serialize(data);
  }

  findAll() {
    return this.Goal.findAll({ include: [{ model: this.Task, as: 'tasks' }] })
      .then(goals => GoalsController.serialize(goals))
      .then(data => GoalsController.defaultResponseOk(data))
      .catch(err => GoalsController.notFound(err));
  }

  findById(id) {
    return this.Goal.find({ where: { id: parseInt(id, 10) }, include: [{ model: this.Task, as: 'tasks' }] })
      .then((goal) => {
        if (!goal) { throw new Error('goal not found'); }
        return GoalsController.serialize(goal);
      })
      .then(data => GoalsController.defaultResponseOk(data))
      .catch(err => GoalsController.notFound(err));
  }

  create(goal) {
    return this.Goal.create(goal)
      .then(record => ({
        status: 201,
        data: GoalSerializer.serialize(record),
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
