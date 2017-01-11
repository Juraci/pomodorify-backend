import { Serializer, Deserializer } from 'jsonapi-serializer';

const serializer = new Serializer('tasks', {
  attributes: ['description', 'createdAt', 'updatedAt'],
});

const deserializer = new Deserializer({
  goals: {
    valueForRelationship: relationship => ({ id: relationship.id }),
  },
});

export { serializer, deserializer };
