import ApplicationSerializer from './application';

class UserSerializer extends ApplicationSerializer {
  constructor() {
    super({
      type: 'users',
      attributes: ['email', 'password', 'createdAt', 'updatedAt'],
    });
  }
}

export default UserSerializer;
