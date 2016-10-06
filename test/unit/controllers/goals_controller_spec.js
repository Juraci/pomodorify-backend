import GoalsController from '../../../controllers/goals';

describe('GoalsController', function() {
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
        .then(result => {
          expect(Goal.destroy).to.have.been.calledOnce;
          expect(Goal.destroy).to.have.been.calledWith({ where: { id: 1 } });
          done()
        })
        .catch(error => done(error));
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
