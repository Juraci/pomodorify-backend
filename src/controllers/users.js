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

  findById(id) {
    return this.User.find({
      where: { id: parseInt(id, 10) },
      include: [
        { model: this.Goal, as: 'goals' },
      ],
    })
      .then(user => UsersController.throwIfNotFound(user, 'user'))
      .then(user => this.serialize(user))
      .then(data => UsersController.ok(data))
      .catch(err => UsersController.notFound(err));
  }

  updateById(id, user) {
    return this.deserialize(user)
      .then(dsUser => this.User.update(dsUser, { where: { id: parseInt(id, 10) } }))
      .then(result => UsersController.throwIfNotUpdated(result, 'user'))
      .then(() => UsersController.noContent())
      .catch(err => UsersController.notFound(err));
  }
}

export default UsersController;
