import { serializer, deserializer } from '../serializers/task';

export default class TasksController {
  constructor(Task) {
    this.Task = Task;
  }

  serialize(data) {
    return serializer.serialize(data);
  }

  deserialize(data) {
    return deserializer.deserialize(data);
  }

  defaultResponseOk(data) {
    return {
      status: 200,
      data
    };
  }

  defaultResponseCreated(data) {
    return {
      status: 201,
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
          data: this.serialize(tasks)
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

  mountTaskObject(data) {
    let obj;
    if(data.hasOwnProperty('goal')) {
      obj = { description: data.description, goalId: data.goal.id };
    } else {
      obj = { description: data.description };
    }

    return obj;
  }

  create(task) {
    return this.deserialize(task)
      .then(deserializedTask => this.mountTaskObject(deserializedTask))
      .then(taskObject => this.Task.create(taskObject))
      .then(record => this.serialize(record))
      .then(serializedRecord => this.defaultResponseCreated(serializedRecord))
      .catch((err) => {
        return { data: err, status: 400 };
      });
  }
}
