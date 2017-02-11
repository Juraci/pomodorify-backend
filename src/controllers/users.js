import ApplicationController from './application';
import UserSerializer from '../serializers/user';

class UsersController extends ApplicationController {
  constructor(models) {
    const userSerializer = new UserSerializer();

    super({
      serializer: userSerializer.buildSerializer(),
      deserializer: UserSerializer.buildDeserializer(),
    });

    this.Goal = models.Goal;
    this.User = models.User;
  }

  findAll(query) {
    return this.User.findAll({
      where: query.filter,
      include: [
        { model: this.Goal, as: 'goals' },
      ],
    })
      .then(users => this.serialize(users))
      .then(data => UsersController.ok(data))
      .catch(err => UsersController.unprocessableEntity(err));
  }

  findById(id) {
    return this.User.find({
      where: { id: parseInt(id, 10) },
      include: [
        { model: this.Goal, as: 'goals' },
      ],
    })
      .then(user => UsersController.throwIfNotFound(user))
      .then(user => this.serialize(user))
      .then(data => UsersController.ok(data))
      .catch(err => UsersController.notFound(err));
  }

  updateById(id, user) {
    return this.deserialize(user)
      .then(dsUser => this.User.update(dsUser, { where: { id: parseInt(id, 10) } }))
      .then(result => UsersController.throwIfNotUpdated(result))
      .then(() => UsersController.noContent())
      .catch(err => UsersController.notFound(err));
  }
}

export default UsersController;
