import ApplicationController from './application';
import { serializer, deserializer } from '../serializers/task';

export default class TasksController extends ApplicationController {
  constructor(Task) {
    super({ serializer, deserializer });
    this.Task = Task;
  }

  static defaultResponseOk(data) {
    return {
      status: 200,
      data,
    };
  }

  static defaultResponseCreated(data) {
    return {
      status: 201,
      data,
    };
  }

  static notFound(error) {
    return {
      status: 404,
      data: {
        errors: [
          {
            detail: error.message,
          },
        ],
      },
    };
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
      .then(serializedTasks => TasksController.defaultResponseOk(serializedTasks))
      .catch(err => ({
        data: err,
        status: 500,
      }));
  }

  findById(id) {
    return this.Task.find({ where: { id: parseInt(id, 10) } })
      .then((task) => {
        if (!task) { throw new Error('task not found'); }
        return this.serialize(task);
      })
      .then(data => TasksController.defaultResponseOk(data))
      .catch(err => TasksController.notFound(err));
  }

  create(task) {
    return this.deserialize(task)
      .then(deserializedTask => TasksController.mountTaskObject(deserializedTask))
      .then(taskObject => this.Task.create(taskObject))
      .then(record => this.serialize(record))
      .then(serializedRecord => TasksController.defaultResponseCreated(serializedRecord))
      .catch(err => ({ data: err, status: 400 }));
  }
}
