describe('goals', function() {
  const Goal = app.datasource.models.Goal;

  describe('GET /goals', function() {
    beforeEach((done) => {
      app.datasource.sequelize.sync().then(() => {
        Goal
          .destroy({ where: {} })
          .then(() => {
            return Goal.create({ description: 'Feel comfortable with Node.js' });
          }).then(() => {
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
          expect(res.body.data[0].attributes.description).to.equal('Feel comfortable with Node.js');
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

    beforeEach((done) => {
      Goal
        .destroy({ where: {} })
        .then(() => {
          done();
        });
    });

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
});
