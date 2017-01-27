import HttpStatus from 'http-status-codes';

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

  static defaultResponse(status, data) {
    return {
      status,
      data,
    };
  }

  static ok(data) {
    return ApplicationController.defaultResponse(HttpStatus.OK, data);
  }

  static created(data) {
    return ApplicationController.defaultResponse(HttpStatus.CREATED, data);
  }

  static noContent() {
    return ApplicationController.defaultResponse(HttpStatus.NO_CONTENT, { data: 'No content' });
  }

  static jsonApiError(status, error) {
    return {
      status,
      data: {
        errors: [
          {
            detail: error.message,
          },
        ],
      },
    };
  }
}

export default ApplicationController;
