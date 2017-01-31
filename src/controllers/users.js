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
    return this.User.findAll({ where: query.filter, include: [{ model: this.Goal, as: 'goals' }] })
      .then(users => this.serialize(users))
      .then(data => UsersController.ok(data))
      .catch(err => UsersController.jsonApiError(500, err));
  }

  findById(id) {
    return this.User.find({ where: { id: parseInt(id, 10) }, include: [{ model: this.Goal, as: 'goals' }] })
      .then((user) => {
        if (!user) { throw new Error('user not found'); }
        return this.serialize(user);
      })
      .then(data => UsersController.ok(data))
      .catch(err => UsersController.notFound(err));
  }

  updateById(id, user) {
    return this.deserialize(user)
      .then(dsUser => this.User.update(dsUser, { where: { id: parseInt(id, 10) } }))
      .then((result) => {
        if (result[0] !== 1) { throw new Error('user not found'); }
        return UsersController.noContent();
      })
      .catch(err => UsersController.notFound(err));
  }
}

export default UsersController;
