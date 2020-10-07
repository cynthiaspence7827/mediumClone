const { validationResult } = require("express-validator")


function asyncHandler(handler) {
  return (req, res, next) => {
    return handler(req, res, next).catch(next)
  }
}


function handleValidationErrors(req, res, next) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map(error => error.msg);
    const err = Error("Bad request.");
    err.errors = errors;
    err.title = "400 Bad request.";
    err.status = 400;
    return next(err);
  } else next();
}


function contentNotFound(id, contentType) {
  const err = new Error(`${contentType} id ${id} could not be found.`);
  err.title = `404 ${contentType} not found`;
  err.status = 404;
  return err;
}

async function deleteForStory(id, Model) {
  const records = Model.findAll({ where: { storyId: id } })
  records.forEach(async record => await record.destroy())
}

async function checkForStory(req, res, next) {
  const story = await Story.findbyPk(req.params.id)
  if (!story) next(contentNotFound(req.params.id, "Story"))
  else {
    req.story = story
    next()
  }
}
async function checkForUser(req, res, next) {
  const user = await User.findByPk(req.params.id)
  if (!user) next(contentNotFound(req.params.id, "User"))
  else {
    req.user = user
    next()
  }
}
async function checkForComment(req, res, next) {
  const comment = await Comment.findByPk(req.params.id)
  if (!comment) next(contentNotFound(req.params.id, "Comment"))
  else {
    req.comment = comment
    next()
  }
}
function checkForContent(res, content) {
  if (content.length) {
    res.json(content)
  } else {
    res.status(204).end()
  }
}

module.exports = {
  asyncHandler,
  handleValidationErrors,
  contentNotFound,
  deleteForStory,
  checkForStory,
  checkForUser,
  checkForComment,
  checkForContent
}
