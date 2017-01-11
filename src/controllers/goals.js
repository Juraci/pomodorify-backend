import GoalSerializer from '../serializers/goal';

class GoalsController {
  constructor(models) {
    this.Goal = models.Goal;
    this.Task = models.Task
  }

  defaultResponseOk(data) {
    return {
      status: 200,
      data
    };
  }

  notFound(error) {
    return {
      status: 404,
      data: {
        errors: [
          {
            title: 'not found',
            detail: error
          }
        ]
      }
    };
  }

  serialize(data) {
    return GoalSerializer.serialize(data);
  }

  findAll() {
    return this.Goal.findAll({ include: [{model: this.Task, as: 'tasks'}] })
      .then(goals => this.serialize(goals))
      .then(data => this.defaultResponseOk(data))
      .catch(err => this.notFound(err));
  }

  findById(id) {
    return this.Goal.find({ where: { id: parseInt(id) }, include: [{model: this.Task, as: 'tasks'}] })
      .then(goal => {
        if(!goal) { throw 'goal not found'; }
        return this.serialize(goal);
      })
      .then(data => this.defaultResponseOk(data))
      .catch(err => this.notFound(err));
  }

  create(goal) {
    return this.Goal.create(goal)
      .then((record) => {
        return {
          status: 201,
          data: GoalSerializer.serialize(record)
        };
      })
      .catch((err) => {
        return { data: err, status: 400 };
      });
  }

  deleteById(id) {
    return this.Goal.destroy({ where: { id: parseInt(id) } })
      .then(() => {
        return { status: 204 };
      })
      .catch((err) => {
        return { data: err, status: 400 };
      });
  }

}

export default GoalsController;
