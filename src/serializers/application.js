import { Serializer, Deserializer } from 'jsonapi-serializer';

class ApplicationSerializer {
  constructor({ type, attributes, relationships }) {
    this.type = type;
    this.attributes = attributes;
    this.relationships = relationships || [];
  }

  buildSerializer(included = false) {
    const attributes = this.attributes;
    const relationCollection = [];

    this.relationships.forEach((r) => {
      attributes.push(r.type);
      relationCollection.push({
        name: r.type,
        config: {
          ref: 'id',
          included,
          attributes: r.attributes,
        },
      });
    });

    const params = {
      attributes,
    };

    relationCollection.forEach((rc) => {
      params[rc.name] = rc.config;
    });

    return new Serializer(this.type, params);
  }

  static buildDeserializer(params = {}) {
    return new Deserializer(params);
  }
}

export default ApplicationSerializer;
