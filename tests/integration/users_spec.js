describe('users', () => {
  const User = app.datasource.models.User;

  beforeEach((done) => {
    app.datasource.sequelize.sync().then(() => {
      User
        .destroy({ where: {} })
        .then(() => {
          done();
        });
    });
  });

  describe('GET /users', () => {
    beforeEach((done) => {
      app.datasource.sequelize.sync()
        .then(() => {
          User
            .create({ email: 'user@example.com', password: 'somePass123' })
            .then(() => {
              done();
            });
        });
    });

    it('returns all existing users', (done) => {
      request
        .get('/users')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.have.length(1);
          const record = res.body.data[0];
          expect(record).to.have.any.keys('id');
          expect(record.type).to.be.equal('users');
          expect(record.attributes.email).to.be.equal('user@example.com');
          expect(record.attributes).to.have.all.keys('created-at', 'updated-at', 'email', 'password');
          done(err);
        });
    });
  });
});
