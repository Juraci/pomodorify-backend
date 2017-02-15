import ApplicationController from './application';
import UserSerializer from '../serializers/user';

class UsersController extends ApplicationController {
  constructor(models) {
    const userSerializer = new UserSerializer();

    super({
      serializer: userSerializer.buildSerializer(),
      deserializer: UserSerializer.buildDeserializer(),
      model: models.User,
      relations: [{ model: models.Goal, as: 'goals' }],
    });

    this.Goal = models.Goal;
    this.User = models.User;
  }
}

export default UsersController;
