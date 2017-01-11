describe('goals', function() {
  const Goal = app.datasource.models.Goal;
  const Task = app.datasource.models.Task;

  beforeEach(done => {
    app.datasource.sequelize.sync().then(() => {
      Goal
        .destroy({ where: {} })
        .then(() => {
          done();
        });
    });
  });

  describe('GET /goals', function() {
    let goal;

    beforeEach(done => {
      app.datasource.sequelize.sync()
        .then(() => {
          Goal.create({ description: 'Feel comfortable with Node.js' })
            .then(newGoal => {
              goal = newGoal;
              done();
            });
        });
    });

    it('returns all existing goals', function(done) {
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

    context('when the goal has related tasks', function() {
      let task;
      beforeEach(done => {
        Task.create({ description: 'Code School - Real time web with Node Lvl 1', goalId: goal.id })
          .then(newTask => {
            task = newTask;
            done();
          })
          .catch(err => done(err));
      })

      it('should return the related tasks', function(done) {
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
            expect(res.body.included[0].type).to.be.equal('tasks');
            expect(res.body.included[0].id).to.be.equal(`${task.id}`);
            expect(res.body.included[0].attributes.description).to.be.equal(task.description);
            done(err);
          });
      });
    });
  });

  describe('GET /goals/:id', function() {
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

    it('returns the goal by its id', function(done) {
      request
        .get(`/goals/${goal.id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data.attributes.description).to.equal('Feel confortable with React');
          done(err);
        });
    });

    context("when the goal id doesn't exist", function() {
      it('returns 404 not found JSONAPI compliant', function(done) {
        request
          .get('/goals/666')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.errors).to.have.length(1);
            expect(res.body.errors[0].title).to.be.equal('not found');
            expect(res.body.errors[0].detail).to.be.equal('goal not found');
            done(err);
          });
      });
    });
  });

  describe('POST /goals', function() {
    const goal = {
      data: {
        type: 'goals',
        attributes: {
          description: 'Feel comfortable with CSS'
        }
      }
    }

    it('creates a new goal', function(done) {
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

  describe('DELETE /goals/:id', function() {
    let goalId;

    beforeEach((done) => {
      app.datasource.sequelize.sync().then(() => {
        Goal.create({ description: 'Feel comfortable with Node.js' })
          .then(goal => {
            goalId = goal.id;
            done();
          });
      });
    });

    it('deletes a goal', function(done) {
      request
        .del(`/goals/${goalId}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done(err);
        });
    });
  });
});
