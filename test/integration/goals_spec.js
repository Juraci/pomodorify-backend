describe('goals', function() {
  const Goal = app.db.models.Goal;

  describe('GET /goals', function() {
    beforeEach((done) => {
      app.db.sequelize.sync().then(() => {
        Goal
        .destroy({ where: {} })
        .then(() => {
          return Goal.create({ description: 'Learn Node.js' });
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
          console.log(JSON.stringify(res.body));
          expect(res.body.data).to.have.length(1);
          expect(res.body.data[0].attributes.description).to.equal('Learn Node.js');
          done(err);
        });
    });
  });
});
