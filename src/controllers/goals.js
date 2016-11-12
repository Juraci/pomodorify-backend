class GoalsController {
  constructor(Goal) {
    this.Goal = Goal;
  }

  findAll() {
    return this.Goal.findAll()
      .then((goals) => {
        let goalsObj = { data: [] };
        goals.forEach((goal) => {
          goalsObj.data.push(
            {
              type: 'goals',
              id: goal.id,
              attributes: {
                description: goal.description,
                createdAt: goal.createdAt,
                updatedAt: goal.updatedAt
              }
            }
          );
        });
        return {
          data: goalsObj,
          status: 200
        };
      })
      .catch((err) => {
        return {
          data: err,
          sattus: 404
        }
      });
  }

  create(goal) {
    return this.Goal.create(goal)
      .then(() => {
        return { status: 204 };
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
