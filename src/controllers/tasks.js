import ApplicationController from './application';
import TaskSerializer from '../serializers/task';

class TasksController extends ApplicationController {
  constructor(Task) {
    const taskSerializer = new TaskSerializer();

    super({
      serializer: taskSerializer.buildSerializer(),
      deserializer: TaskSerializer.buildDeserializer(),
    });

    this.Task = Task;
  }

  static mountTaskObject(data) {
    let obj;
    if (Object.prototype.hasOwnProperty.call(data, 'goal')) {
      obj = { description: data.description, goalId: data.goal.id };
    } else {
      obj = { description: data.description };
    }

    return obj;
  }

  findAll() {
    return this.Task.findAll()
      .then(tasks => this.serialize(tasks))
      .then(serializedTasks => TasksController.ok(serializedTasks))
      .catch(err => TasksController.jsonApiError(500, err));
  }

  findById(id) {
    return this.Task.find({ where: { id: parseInt(id, 10) } })
      .then((task) => {
        if (!task) { throw new Error('task not found'); }
        return this.serialize(task);
      })
      .then(data => TasksController.ok(data))
      .catch(err => TasksController.notFound(err));
  }

  create(task) {
    return this.deserialize(task)
      .then(deserializedTask => TasksController.mountTaskObject(deserializedTask))
      .then(taskObject => this.Task.create(taskObject))
      .then(record => this.serialize(record))
      .then(serializedRecord => TasksController.created(serializedRecord))
      .catch(err => TasksController.jsonApiError(400, err));
  }

  updateById(id, task) {
    return this.deserialize(task)
      .then(dsTask => this.Task.update(dsTask, { where: { id: parseInt(id, 10) } }))
      .then((result) => {
        if (result[0] !== 1) { throw new Error('task not found'); }
        return TasksController.noContent();
      })
      .catch(err => TasksController.notFound(err));
  }
}

export default TasksController;
