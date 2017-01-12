import ApplicationController from './application';
import { serializer, deserializer } from '../serializers/task';

export default class TasksController extends ApplicationController {
  constructor(Task) {
    super({ serializer, deserializer });
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
      .then(serializedTasks => ApplicationController.ok(serializedTasks))
      .catch(err => ApplicationController.jsonApiError(500, err));
  }

  findById(id) {
    return this.Task.find({ where: { id: parseInt(id, 10) } })
      .then((task) => {
        if (!task) { throw new Error('task not found'); }
        return this.serialize(task);
      })
      .then(data => ApplicationController.ok(data))
      .catch(err => ApplicationController.jsonApiError(404, err));
  }

  create(task) {
    return this.deserialize(task)
      .then(deserializedTask => TasksController.mountTaskObject(deserializedTask))
      .then(taskObject => this.Task.create(taskObject))
      .then(record => this.serialize(record))
      .then(serializedRecord => ApplicationController.created(serializedRecord))
      .catch(err => ApplicationController.jsonApiError(400, err));
  }
}
