import { Serializer, Deserializer } from 'jsonapi-serializer';

const serializer = new Serializer('goal', {
  attributes: ['description', 'createdAt', 'updatedAt', 'tasks'],
  tasks: {
    ref: 'id',
    attributes: ['description', 'createdAt', 'updatedAt'],
  },
});

const deserializer = new Deserializer();

export { serializer, deserializer };
