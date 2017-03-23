const isExpectedError = error => !!error.match(error);

const resilientStart = ({ app, port, appInitializer, retryTime, error }) =>
  appInitializer(app)
    .catch((err) => {
      if (!isExpectedError(err.name)) {
        throw err;
      }

      setTimeout(() => resilientStart({
        app,
        port,
        appInitializer,
        retryTime,
        error,
      }), retryTime);
    });

module.exports = resilientStart;
