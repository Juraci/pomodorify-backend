const resilientStart = ({ app, port, appInitializer, maxAttempts, retryTime, error }, attempts = 0) => {
  return appInitializer(app)
    .then((app) => {
      app.listen(port, () => {
        console.log(`Magic on port ${port}`);
      });
    })
    .catch((err) => {
      if (!isExpectedError(err.name) || attempts >= maxAttempts) {
        throw err;
      }

      attempts += 1;
      setTimeout(() => {
        return resilientStart({
          app,
          port,
          appInitializer,
          maxAttempts,
          retryTime,
          error
        }, attempts);
      }, retryTime);
    });
};

const isExpectedError = (error) => {
  return !!error.match(error);
};

module.exports  = resilientStart;
