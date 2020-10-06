const { validationResult } = require("express-validator")


function asyncHandler(handler) {
  return (req, res, next) => {
    return handler(req, res, next).catch(next)
  }
}


const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map(error => error.msg);
    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "400 Bad request.";
    return next(err);
  }
  next();
};

module.exports = {
  asyncHandler,
  handleValidationErrors
}
