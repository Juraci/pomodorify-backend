class ApplicationController {
  constructor({ serializer, deserializer }) {
    this.serializer = serializer;
    this.deserializer = deserializer;
  }

  serialize(data) {
    return this.serializer.serialize(data);
  }

  deserialize(data) {
    return this.deserializer.deserialize(data);
  }
}

export default ApplicationController;
