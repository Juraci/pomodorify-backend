import HttpStatus from 'http-status-codes';

class ApplicationController {
  constructor({ serializer, deserializer, model, relations }) {
    this.serializer = serializer;
    this.deserializer = deserializer;
    this.model = model;
    this.relations = relations;
  }

  serialize(data) {
    return this.serializer.serialize(data);
  }

  deserialize(data) {
    return this.deserializer.deserialize(data);
  }

  findAll(query) {
    return this.model.findAll({
      where: query.filter,
      include: this.relations,
    })
      .then(records => this.serialize(records))
      .then(data => ApplicationController.ok(data))
      .catch(err => ApplicationController.unprocessableEntity(err));
  }

  findById(id) {
    return this.model.find({
      where: { id: parseInt(id, 10) },
      include: this.relations,
    })
      .then(record => ApplicationController.throwIfNotFound(record))
      .then(record => this.serialize(record))
      .then(data => ApplicationController.ok(data))
      .catch(err => ApplicationController.notFound(err));
  }

  updateById(id, payload) {
    return this.deserialize(payload)
      .then(dsPayload => this.model.update(dsPayload, { where: { id: parseInt(id, 10) } }))
      .then(result => ApplicationController.throwIfNotUpdated(result))
      .then(() => ApplicationController.noContent())
      .catch(err => ApplicationController.notFound(err));
  }

  create(data, mountObj) {
    return this.deserialize(data)
      .then(dsData => mountObj(dsData))
      .then(mountedObj => this.model.create(mountedObj))
      .then(record => this.serialize(record))
      .then(serializedObj => ApplicationController.created(serializedObj))
      .catch(err => ApplicationController.jsonApiError(400, err));
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

  static notFound(err) {
    return ApplicationController.jsonApiError(HttpStatus.NOT_FOUND, err);
  }

  static unprocessableEntity(err) {
    return ApplicationController.jsonApiError(HttpStatus.UNPROCESSABLE_ENTITY, err);
  }

  static throwIfNotFound(resource) {
    if (!resource) { throw new Error('resource not found'); }
    return resource;
  }

  static throwIfNotUpdated(result) {
    if (result[0] !== 1) { throw new Error('resource not found'); }
  }
}

export default ApplicationController;
