import ApplicationSerializer from './application';
import TaskSerializer from './task';

class GoalSerializer extends ApplicationSerializer {
  constructor() {
    super({
      type: 'goals',
      attributes: ['description', 'createdAt', 'updatedAt'],
      relationships: [new TaskSerializer()],
    });
  }
}

export default GoalSerializer;
