import GoalsController from '../../../src/controllers/goals';

describe('GoalsController', function() {
  const defaultGoal = {
    id: '123',
    description: 'Feel comfortable with Node.js development',
    createdAt: '2016-10-06T20:11:32.598Z',
    updatedAt: '2016-10-06T20:11:32.598Z'
  };

  describe('#findAll', function() {
    const Goal = {
      findAll() {
        return Promise.resolve([defaultGoal]);
      }
    };

    let goalsController;
    sinon.spy(Goal, 'findAll');

    beforeEach(() => {
      goalsController = new GoalsController(Goal);
    });

    afterEach(() => {
      Goal.findAll.reset();
    });

    it('should send findAll message to Goal model', function(done) {
      goalsController.findAll()
        .then(() => {
          expect(Goal.findAll).to.have.been.calledOnce;
          done();
        })
        .catch(err => done(err));
    });

    it('returns the collection of Goals', function(done) {
      goalsController.findAll()
        .then((result) => {
          expect(result.status).to.be.equal(200);
          expect(result.data.data).to.have.length(1);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('#create', function() {
    const Goal = {
      create() {
        return Promise.resolve(defaultGoal);
      }
    };

    let goalsController;
    sinon.spy(Goal, 'create');

    beforeEach(() => {
      goalsController = new GoalsController(Goal);
    });

    afterEach(() => {
      Goal.create.reset();
    });

    it('should send create message on the Goal model passing the goal object', function(done) {
      let goal = { description: 'Feel comfortable with Node.js' };

      goalsController.create(goal)
        .then((result) => {
          expect(Goal.create).to.have.been.calledWith(goal);
          expect(result.status).to.be.equal(201);
          expect(result.data.data.type).to.be.equal('goals');
          expect(result.data.data.attributes.description).to.be.equal('Feel comfortable with Node.js development');
          expect(result.data.data.attributes).to.have.all.keys('created-at', 'updated-at', 'description');
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('#deleteById', function() {
    const Goal = {
      destroy() {
        return Promise.resolve(1);
      }
    }

    let goalsController;
    sinon.spy(Goal, 'destroy');

    beforeEach(() => {
      goalsController = new GoalsController(Goal);
    });

    afterEach(() => {
      Goal.destroy.reset();
    });

    it('should send destroy message on Goal model passing the id', function(done) {
      goalsController.deleteById('1')
        .then(() => {
          expect(Goal.destroy).to.have.been.calledOnce;
          expect(Goal.destroy).to.have.been.calledWith({ where: { id: 1 } });
          done()
        })
        .catch(err => done(err));
    });

    it('returns 204 on success', function(done) {
      goalsController.deleteById('1')
        .then(result => {
          expect(result.status).to.be.equal(204);
          done()
        })
        .catch(error => done(error));
    });
  });
});