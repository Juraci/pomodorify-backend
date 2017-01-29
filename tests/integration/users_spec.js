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

  describe('GET /users/:id', () => {
    let user;

    beforeEach((done) => {
      app.datasource.sequelize.sync()
        .then(() => {
          User
            .create({ email: 'user@example.com', password: 'somePass123' })
            .then((newUser) => {
              user = newUser;
              done();
            });
        });
    });

    it('returns the user by its id', (done) => {
      request
        .get(`/users/${user.id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data.attributes.email).to.equal('user@example.com');
          expect(res.body.data.attributes.password).to.equal('somePass123');
          done(err);
        });
    });

    context("when the user id doesn't exist", () => {
      it('returns 404 not found JSONAPI compliant', (done) => {
        request
          .get('/users/666')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.errors).to.have.length(1);
            expect(res.body.errors[0].detail).to.be.equal('user not found');
            done(err);
          });
      });
    });
  });
});
