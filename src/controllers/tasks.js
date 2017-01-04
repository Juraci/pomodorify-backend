import TaskSerializer from '../serializers/task';

export default class TasksController {
  constructor(Task) {
    this.Task = Task;
  }

  findAll() {
    return this.Task.findAll()
      .then((tasks) => {
        console.log('>>> Find All');
       let response =  {
          status: 200,
          data: TaskSerializer.serialize(tasks)
        };

        console.log('>> response', response.data);
        return response;
      })
      .catch((err) => {
        console.log('>>>', err);
        return {
          data: err,
          status: 404
        };
      });
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
