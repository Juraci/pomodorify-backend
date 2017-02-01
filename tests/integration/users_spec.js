describe('users', () => {
  const User = app.datasource.models.User;

  beforeEach((done) => {
    destroyAll(done);
  });

  describe('GET /users', () => {
    beforeEach((done) => {
      app.datasource.sequelize.sync()
        .then(() => {
          User
            .create({ email: 'user@example.com', password: 'somePass123' })
            .then(() => User.create({ email: 'user2@example.com', password: 'somePass123' }))
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
          expect(res.body.data).to.have.length(2);
          const record = res.body.data[0];
          expect(record).to.have.any.keys('id');
          expect(record.type).to.be.equal('users');
          expect(record.attributes).to.have.all.keys('created-at', 'updated-at', 'email', 'password');
          done(err);
        });
    });

    context('when filtering users by email', () => {
      it('returns the user with the given email', (done) => {
        request
          .get('/users?filter[email]=user@example.com')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.length(1);
            const record = res.body.data[0];
            expect(record.attributes.email).to.be.equal('user@example.com');
            done(err);
          });
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

  describe('PATCH /users/:id', () => {
    let user;
    const updatedUser = {
      data: {
        type: 'users',
        attributes: {
          email: 'another@email.com',
        },
      },
    };

    beforeEach((done) => {
      app.datasource.sequelize.sync()
        .then(() => {
          User
            .create({ email: 'user@example.com', password: 'somepass123' })
            .then((newuser) => {
              user = newuser;
              done();
            });
        });
    });

    it('updates the user properties', (done) => {
      request
        .patch(`/users/${user.id}`)
        .send(updatedUser)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          User
            .find({ where: { id: user.id } })
            .then((record) => {
              expect(record.email).to.be.equal(updatedUser.data.attributes.email);
              done(err);
            });
        });
    });

    context('when trying to update a user that does not exist', () => {
      it('returns 404 json api compliant error', (done) => {
        request
          .patch('/users/666')
          .send(updatedUser)
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
