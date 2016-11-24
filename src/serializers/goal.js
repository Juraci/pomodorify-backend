import { Serializer } from 'jsonapi-serializer';

export default new Serializer('goals', {
  attributes: ['description', 'createdAt', 'updatedAt']
});
