describe('goals', () => {
  const Task = app.datasource.models.Task;
  const Goal = app.datasource.models.Goal;
  const User = app.datasource.models.User;

  beforeEach((done) => {
    destroyAll(done);
  });

  describe('GET /goals', () => {
    let goal;

    beforeEach((done) => {
      app.datasource.sequelize.sync()
        .then(() => {
          Goal.create({ description: 'Feel comfortable with Node.js' })
            .then((newGoal) => {
              goal = newGoal;
              done();
            });
        });
    });

    it('returns all existing goals', (done) => {
      request
        .get('/goals')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.have.length(1);
          const record = res.body.data[0];
          expect(record).to.have.any.keys('id');
          expect(record.type).to.be.equal('goals');
          expect(record.attributes.description).to.be.equal('Feel comfortable with Node.js');
          expect(record.attributes).to.have.all.keys('created-at', 'updated-at', 'description');
          done(err);
        });
    });

    context('when the goal has related tasks', () => {
      let task;
      beforeEach((done) => {
        Task.create({ description: 'Code School - Real time web with Node Lvl 1', goalId: goal.id })
          .then((newTask) => {
            task = newTask;
            done();
          })
          .catch(err => done(err));
      });

      it('should return the related tasks', (done) => {
        request
          .get('/goals')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.length(1);
            const record = res.body.data[0];
            expect(record).to.have.property('relationships');
            expect(record.relationships.tasks.data).to.have.length(1);
            expect(record.relationships.tasks.data[0].id).to.be.equal(`${task.id}`);
            expect(res.body).to.have.property('included');
            const includedTask = res.body.included[0];
            expect(includedTask.attributes).to.have.all.keys('created-at', 'updated-at', 'description', 'pomodoros');
            done(err);
          });
      });
    });

    context('when filtering goals', () => {
      let user;

      beforeEach((done) => {
        User.create({ email: 'sample@example.com', password: 'abcd1234' })
          .then((newUser) => {
            user = newUser;
            return Goal.create({ description: 'some stuff', userId: newUser.id });
          })
          .then(() => done())
          .catch(err => done(err));
      });

      it('returns the goal when filtering by user id', (done) => {
        request
          .get(`/goals?filter[userId]=${user.id}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.length(1);
            done();
          });
      });
    });
  });

  describe('GET /goals/:id', () => {
    let goal;

    beforeEach((done) => {
      app.datasource.sequelize.sync()
        .then(() => {
          Goal.create({ description: 'Feel confortable with React' })
            .then((record) => {
              goal = record;
              done();
            });
        });
    });

    it('returns the goal by its id', (done) => {
      request
        .get(`/goals/${goal.id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data.attributes.description).to.equal('Feel confortable with React');
          done(err);
        });
    });

    context("when the goal id doesn't exist", () => {
      it('returns 404 not found JSONAPI compliant', (done) => {
        request
          .get('/goals/666')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.errors).to.have.length(1);
            expect(res.body.errors[0].detail).to.be.equal('resource not found');
            done(err);
          });
      });
    });

    context('when the goal has related tasks', () => {
      let task;

      beforeEach((done) => {
        Task.create({ description: 'Code School - Real time web with Node Lvl 1', goalId: goal.id })
          .then((newTask) => {
            task = newTask;
            done();
          })
          .catch(err => done(err));
      });

      it('should return the goal and its related tasks', (done) => {
        request
          .get(`/goals/${goal.id}`)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            const record = res.body.data;
            expect(record).to.have.property('relationships');
            expect(record.relationships.tasks.data).to.have.length(1);
            expect(record.relationships.tasks.data[0].id).to.be.equal(`${task.id}`);
            expect(res.body).to.have.property('included');
            expect(res.body.included[0].type).to.be.equal('tasks');
            expect(res.body.included[0].id).to.be.equal(`${task.id}`);
            expect(res.body.included[0].attributes.description).to.be.equal(task.description);
            done(err);
          });
      });
    });
  });

  describe('POST /goals', () => {
    context('when posting GOAL without relationship', () => {
      const goal = {
        data: {
          type: 'goals',
          attributes: {
            description: 'Feel comfortable with CSS',
          },
        },
      };

      it('creates a new goal', (done) => {
        request
          .post('/goals')
          .send(goal)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.data.type).to.be.equal('goals');
            expect(res.body.data.attributes.description).to.be.equal('Feel comfortable with CSS');
            expect(res.body.data.attributes).to.have.all.keys('created-at', 'updated-at', 'description');
            done(err);
          });
      });
    });

    context('when posting with relationship', () => {
      let user;

      beforeEach((done) => {
        app.datasource.sequelize.sync()
          .then(() => {
            User.create({ email: 'email@sample.com', password: '1234' })
              .then((newUser) => {
                user = newUser;
                done();
              });
          });
      });

      it('creates the goal related to a user', (done) => {
        const goal = {
          data: {
            type: 'goals',
            attributes: {
              description: 'Feel comfortable with CSS',
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: `${user.id}`,
                },
              },
            },
          },
        };

        request
          .post('/goals')
          .send(goal)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.data.type).to.be.equal('goals');
            Goal.find({ where: { id: res.body.data.id } })
              .then((record) => {
                expect(record.userId).to.be.equal(user.id);
                done(err);
              });
          });
      });
    });
  });

  describe('DELETE /goals/:id', () => {
    let goalId;

    beforeEach((done) => {
      app.datasource.sequelize.sync().then(() => {
        Goal.create({ description: 'Feel comfortable with Node.js' })
          .then((goal) => {
            goalId = goal.id;
            done();
          });
      });
    });

    it('deletes a goal', (done) => {
      request
        .del(`/goals/${goalId}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done(err);
        });
    });

    context('when trying to delete a goal that does not exist', () => {
      it('returns 404 json api compliant error', (done) => {
        request
          .del('/goals/666')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.errors).to.have.length(1);
            expect(res.body.errors[0].detail).to.be.equal('resource not found');
            done(err);
          });
      });
    });
  });

  describe('PATCH /goals/:id', () => {
    let goal;
    const updatedGoal = {
      data: {
        type: 'goals',
        attributes: {
          description: 'Feel comfortable with CSS',
        },
      },
    };

    beforeEach((done) => {
      app.datasource.sequelize.sync()
        .then(() => {
          Goal.create({ description: 'Feel comfortable with Node.js' })
            .then((newGoal) => {
              goal = newGoal;
              done();
            });
        });
    });

    it('updates the goal', (done) => {
      request
        .patch(`/goals/${goal.id}`)
        .send(updatedGoal)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          Goal.find({ where: { id: goal.id } })
            .then((record) => {
              expect(record.description).to.be.equal(updatedGoal.data.attributes.description);
              done(err);
            });
        });
    });

    context('when trying to update a goal that does not exist', () => {
      it('returns 404 json api compliant error', (done) => {
        request
          .patch('/goals/666')
          .send(updatedGoal)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.errors).to.have.length(1);
            expect(res.body.errors[0].detail).to.be.equal('resource not found');
            done(err);
          });
      });
    });
  });
});
