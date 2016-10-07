import GoalsController from '../../../controllers/goals';

describe('GoalsController', function() {
  describe('#findAll', function() {
    const defaultGoal = {
      destription: 'Feel comfortable with Node.js development',
      createdAt: '2016-10-06T20:11:32.598Z',
      updatedAt: '2016-10-06T20:11:32.598Z'
    };

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

    it('should call findAll on the Goal model', function(done) {
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

    it('should call destroy on Goal model passing the id', function(done) {
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
