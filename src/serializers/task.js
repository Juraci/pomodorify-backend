import ApplicationSerializer from './application';

class TaskSerializer extends ApplicationSerializer {
  constructor() {
    super({
      type: 'tasks',
      attributes: ['description', 'pomodoros', 'createdAt', 'updatedAt'],
    });
  }

  static buildDeserializer() {
    return ApplicationSerializer.buildDeserializer({
      goals: {
        valueForRelationship: relationship => ({ id: relationship.id }),
      },
    });
  }
}

export default TaskSerializer;
