import TasksController from '../../../src/controllers/tasks';

describe('TasksController', function() {
  const defaultTask = {
    id: '123',
    description: 'Read the first chapter of Rock and Roll with Ember.js',
    createdAt: '2016-10-06T20:11:32.598Z',
    updatedAt: '2016-10-06T20:11:32.598Z'
  };

  describe('#findAll', function() {
    const Task = {
      findAll() {
        return Promise.resolve([defaultTask]);
      }
    };

    let tasksController;
    sinon.spy(Task, 'findAll');

    beforeEach(() => {
      tasksController = new TasksController(Task);
    });

    afterEach(() => {
      Task.findAll.reset();
    });

    it('should send findAll message to Task model', function(done) {
      tasksController.findAll()
        .then(() => {
          expect(Task.findAll).to.have.been.calledOnce;
          done();
        })
        .catch(err => done(err));
    });
  });
});
