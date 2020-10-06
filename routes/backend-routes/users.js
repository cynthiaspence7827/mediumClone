const bcrypt = require("bcryptjs")
const bearerToken = require("express-bearer-token")
const { check } = require("express-validator")
const { asyncHandler, handleValidationErrors } = require("../../utils")
const { makeUserToken, requireAuthentication } = require("../../auth")
const { User } = require("../../db/models")

const express = express()
const usersRouter = express.Router()


// Get User by id
usersRouter.get("/:id", asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id)
  await res.json({ user })
}))

// Delete User by id.
usersRouter.delete("/:id", asyncHandler((req, res) => {
  const user = await User.findByPk(req.params.id)
  await user.destroy()
}))

// Edit User data by id.
usersRouter.put("/:id", asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  // TODO MIRA How to handle changing passwords...
  const user = await User.findByPk(req.params.id)
  await user.update({ firstName, lastName, email })
}))

// Create a new User.
// TODO MIRA Add validations and validation handlers
usersRouter.post("/", asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await User.create({
    firstName, lastName, email, hashedPassword
  })
  // const token = makeUserToken(newUser) // TODO Implement auth AFTER routes.
  await res.status(201).json({ token, user: { id: newUser.id } })
}))

// Create a new JWT token for a user on login(?)
usersRouter.post("/token", asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ where: { email } })
  if (!user || !user.validatePassword(password)) { // MIRA Add to User model?
    const err = new Error("The login failed.")
    err.status(401)
    err.title = "401 Login Failed"
    err.erros = "The provided credentials are INVALID."
    return next(err)
  }
  const token = makeUserToken(user)
  await res.json({ token, user: { id: user.id }})
}))


// Optional? Maybe we'll use or not.
// Follows
usersRouter.get("/:id/follows")

// Bookmarks
usersRouter.get("/:id/bookmarks", asyncHandler(async (req, res) => {
  const bookmarks = Bookmark.
}))


// User Validator Middlewares.
// TODO MIRA Should we break them into separate functions, like twitter-clone?
const userValidators = [
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("Please give us a first name.")
    .isLength({ min: 1, max: 40 })
    .withMessage("A first name must be between 1 to 40 characters in length."),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Please give us a last name.")
    .isLength({ min: 0, max: 40 })
    .withMessage("A last name can't be longer than 40 characters in length."),
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please give us a valid email.")
    .isLength({ max: 80 })
    .withMessage("An email can't be longer than 80 characters in length."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please give us a password.")
    .isLength({ min: 10, max: 80 })
    .withMessage("A password must be between 10 to 80 characters in length.")
]

module.exports = usersRouter