module.exports = function(err, req, res, next) {
  const stringifiedErr = JSON.stringify(err);
  if (stringifiedErr.indexOf("ValidatorError") !== -1) {
    const mongooseErrors = err.errors;
    const errors = [];
    for (let key in mongooseErrors) {
      errors.push(mongooseErrors[key].message);
    }
    res.status(400).json({ errors });
  } else if (stringifiedErr.indexOf("JsonWebTokenError" !== -1)) {
    res.status(400).json({
      message: "Your Authorization token is either empty or invalid"
    });
  } else {
    /* istanbul ignore next */
    res.status(500).json({
      message: "Internal server error, check the console"
    });
  }
};
