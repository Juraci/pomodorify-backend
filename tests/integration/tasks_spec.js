describe('goals', function() {
  const Task = app.datasource.models.Task;
  const Goal = app.datasource.models.Goal;

  beforeEach((done) => {
    app.datasource.sequelize.sync().then(() => {
      Task
        .destroy({ where: {} })
        .then(() => {
          done();
        });
    });
  });

  describe('POST /tasks', function() {
    context('when posting the task without relationship', function() {
      it('should create the task', function(done) {
        const task = {
          data: {
            attributes: {
              description: "Rock and Roll with Ember.js - Read chapter 1"
            },
            type: "tasks"
          }
        };

        request
          .post('/tasks')
          .send(task)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.data.type).to.be.equal('tasks');
            done(err);
          });
      });
    });

    context('when posting with relationship', function() {
      let goal;

      beforeEach((done) => {
        app.datasource.sequelize.sync()
          .then(() => {
            Goal.create({ description: 'Feel comfortable with Ember.js' })
              .then((record) => {
                goal = record;
                done();
              });
          });
      });

      it('should create the task that belongs to a goal', function(done) {
        const task = {
          data: {
            attributes: {
              description: "Rock and Roll with Ember.js - Read chapter 1"
            },
            relationships: {
              goal: {
                data: {
                  type: "goals",
                  id: `${goal.id}`
                }
              }
            },
            type: "tasks"
          }
        };

        request
          .post('/tasks')
          .send(task)
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.data.type).to.be.equal('tasks');
            Task.find({ where: { id: res.body.data.id } })
              .then((record) => {
                expect(record.goalId).to.be.equal(goal.id);
                done(err);
              });
          });
      });
    });
  });

  describe('GET /tasks', function() {
    beforeEach((done) => {
      app.datasource.sequelize.sync()
        .then(() => {
          Task.create({ description: 'Read the first chapter of Rock and Roll with Ember.js' })
            .then(() => {
              done();
            });
        });
    });

    it('returns all existing tasks', function(done) {
      request
        .get('/tasks')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.have.length(1);
          done(err);
        });
    })
  });

  describe('GET /tasks/:id', function() {
    let task;

    beforeEach((done) => {
      app.datasource.sequelize.sync()
        .then(() => {
          Task.create({ description: 'Read the first chapter of Rock and Roll with Ember.js' })
            .then(newTask => {
              task = newTask
              done();
            });
        });
    });

    it('returns a task based on its id', function(done) {
      request
        .get(`/tasks/${task.id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data.attributes.description).to.equal('Read the first chapter of Rock and Roll with Ember.js');
          done(err);
        });
    });

    context('when the task does not exist', function() {
      it('returns 404 not found', function(done) {
        request
          .get('/tasks/666')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.errors).to.have.length(1);
            expect(res.body.errors[0].detail).to.equal('task not found');
            done(err);
          });
      });
    });
  });
});
