import TaskSerializer from '../serializers/task';

export default class TasksController {
  constructor(Task) {
    this.Task = Task;
  }

  serialize(data) {
    return TaskSerializer.serialize(data);
  }

  defaultResponseOk(data) {
    return {
      status: 200,
      data
    };
  }

  notFound(error) {
    return {
      status: 404,
      data: {
        errors: [
          {
            detail: error
          }
        ]
      }
    };
  }

  findAll() {
    return this.Task.findAll()
      .then((tasks) => {
        let response =  {
          status: 200,
          data: TaskSerializer.serialize(tasks)
        };

        return response;
      })
      .catch((err) => {
        return {
          data: err,
          status: 404
        };
      });
  }

  findById(id) {
    return this.Task.find({ where: { id: parseInt(id) } })
      .then(task => {
        if(!task) { throw 'task not found'; }
        return this.serialize(task);
      })
      .then(data => this.defaultResponseOk(data))
      .catch(err => this.notFound(err));
  }

  create(task) {
    return this.Task.create(task)
      .then((record) => {
        return {
          status: 201,
          data: TaskSerializer.serialize(record)
        };
      })
      .catch((err) => {
        return { data: err, status: 400 };
      });
  }
}
