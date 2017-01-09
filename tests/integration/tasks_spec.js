describe('goals', function() {
  const Task = app.datasource.models.Task;

  beforeEach((done) => {
    app.datasource.sequelize.sync().then(() => {
      Task
        .destroy({ where: {} })
        .then(() => {
          done();
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
