import TasksController from '../../../src/controllers/tasks';

describe('TasksController', () => {
  const defaultTask = {
    id: '123',
    description: 'Read the first chapter of Rock and Roll with Ember.js',
    createdAt: '2016-10-06T20:11:32.598Z',
    updatedAt: '2016-10-06T20:11:32.598Z',
  };

  describe('#findAll', () => {
    const Task = {
      findAll() {
        return Promise.resolve([defaultTask]);
      },
    };

    let tasksController;
    sinon.spy(Task, 'findAll');

    beforeEach(() => {
      tasksController = new TasksController(Task);
    });

    afterEach(() => {
      Task.findAll.reset();
    });

    it('should send findAll message to Task model', (done) => {
      tasksController.findAll()
        .then(() => {
          // eslint-disable-next-line no-unused-expressions
          expect(Task.findAll).to.have.been.calledOnce;
          done();
        })
        .catch(err => done(err));
    });
  });
});
