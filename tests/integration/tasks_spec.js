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
    })

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
});
