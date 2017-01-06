import GoalSerializer from '../serializers/goal';

class GoalsController {
  constructor(Goal) {
    this.Goal = Goal;
  }

  findAll() {
    return this.Goal.findAll()
      .then((goals) => {
        return {
          status: 200,
          data: GoalSerializer.serialize(goals)
        };
      })
      .catch((err) => {
        return {
          data: err,
          satus: 404
        }
      });
  }

  findById(id) {
    return this.Goal.find({ where: { id: parseInt(id) } })
      .then((goal) => {
        return {
          status: 200,
          data: GoalSerializer.serialize(goal)
        };
      })
      .catch((err) => {
        return {
          status: 404,
          data: err
        };
      });
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
