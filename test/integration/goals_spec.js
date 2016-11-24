describe('goals', function() {
  const Goal = app.datasource.models.Goal;

  beforeEach((done) => {
    app.datasource.sequelize.sync().then(() => {
      Goal
        .destroy({ where: {} })
        .then(() => {
          done();
        });
    });
  });

  describe('GET /goals', function() {
    beforeEach((done) => {
      app.datasource.sequelize.sync().then(() => {
        Goal.create({ description: 'Feel comfortable with Node.js' })
          .then(() => {
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
          expect(res.body.data[0]).to.have.any.keys('id');
          expect(res.body.data[0].type).to.be.equal('goals');
          expect(res.body.data[0].attributes.description).to.be.equal('Feel comfortable with Node.js');
          expect(res.body.data[0].attributes).to.have.all.keys('created-at', 'updated-at', 'description');
          done(err);
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
          expect(res.status).to.equal(204);
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
