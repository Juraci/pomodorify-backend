import ApplicationSerializer from './application';
import GoalSerializer from './goal';

class UserSerializer extends ApplicationSerializer {
  constructor() {
    super({
      type: 'users',
      attributes: ['email', 'password', 'createdAt', 'updatedAt'],
      relationships: [new GoalSerializer()],
    });
  }
}

export default UserSerializer;
