import ApplicationController from './application';
import UserSerializer from '../serializers/user';

class UsersController extends ApplicationController {
  constructor(models) {
    const userSerializer = new UserSerializer();

    super({
      serializer: userSerializer.buildSerializer(),
      deserializer: UserSerializer.buildDeserializer(),
    });

    this.User = models.User;
  }

  findAll() {
    return this.User.findAll()
      .then(users => this.serialize(users))
      .then(data => ApplicationController.ok(data))
      .catch(err => ApplicationController.jsonApiError(500, err));
  }

  findById(id) {
    return this.User.find({ where: { id: parseInt(id, 10) } })
      .then((user) => {
        if (!user) { throw new Error('user not found'); }
        return this.serialize(user);
      })
      .then(data => ApplicationController.ok(data))
      .catch(err => UsersController.jsonApiError(404, err));
  }
}

export default UsersController;
