import ApplicationController from './application';
import TaskSerializer from '../serializers/task';

class TasksController extends ApplicationController {
  constructor(models) {
    const taskSerializer = new TaskSerializer();

    super({
      serializer: taskSerializer.buildSerializer(),
      deserializer: TaskSerializer.buildDeserializer(),
      model: models.Task,
      relations: [],
    });

    this.Task = models.Task;
  }

  static mountTaskObject(data) {
    if ('goal' in data) {
      return { description: data.description, goalId: data.goal.id };
    }
    return { description: data.description };
  }

  create(task) {
    return super.create(task, TasksController.mountTaskObject);
  }

  findAll() {
    return this.Task.findAll()
      .then(tasks => this.serialize(tasks))
      .then(serializedTasks => TasksController.ok(serializedTasks))
      .catch(err => TasksController.unprocessableEntity(err));
  }

  findById(id) {
    return this.Task.find({ where: { id: parseInt(id, 10) } })
      .then(task => TasksController.throwIfNotFound(task))
      .then(task => this.serialize(task))
      .then(data => TasksController.ok(data))
      .catch(err => TasksController.notFound(err));
  }
}

export default TasksController;
