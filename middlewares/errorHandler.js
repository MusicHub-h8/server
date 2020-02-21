module.exports = function(err, req, res, next) {
  const stringifiedErr = JSON.stringify(err);

  if (err.code === 404) {
    res.status(err.code).json({
      message: err.resource + " not found"
    });
    next();
  } else if (stringifiedErr.indexOf("ValidatorError") !== -1) {
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
    res.status(500).json({
      message: "Internal server error, check the console"
    });
    next();
  }
};
