import { Serializer } from 'jsonapi-serializer';

export default new Serializer('goal', {
  attributes: ['description', 'createdAt', 'updatedAt', 'tasks'],
  tasks: {
    ref: 'id',
    attributes: ['description', 'createdAt', 'updatedAt'],
  },
});
