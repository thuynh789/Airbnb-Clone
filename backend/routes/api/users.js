const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email', 'email: Invalid email')
    .notEmpty()
    .bail()
    .isEmail(),
  check('username','username: Please provide a username with at least 4 characters.')
    .notEmpty()
    .bail()
    .isLength({ min: 4 }),
  check('username','username: Username cannot be an email.')
    .not()
    .isEmail(),
  check('password', 'password: Password must be 6 characters or more.')
    .notEmpty()
    .bail()
    .isLength({ min: 6 }),
  check('firstName', 'firstName: First Name is required.')
    .notEmpty(),
  check('lastName', 'lastName: Last Name is required.')
    .notEmpty(),
  handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;

    const existingEmail = await User.findOne({
      where: { email : email }
    })
    const existingUsername = await User.findOne({
      where: { username: username }
    })

    if (existingEmail && existingUsername){
      res.status(403)
      return res.json({
        "message": "User already exists",
        "statusCode": 403,
        "errors": {
          "email": "User with that email already exists",
          "username": "User with that username already exists"
        }
      })
    }
    if (existingEmail) {
      res.status(403)
      return res.json({
        "message": "User already exists",
        "statusCode": 403,
        "errors": {
          "email": "User with that email already exists"
        }
      })
    }
    if (existingUsername) {
      res.status(403)
      return res.json({
        "message": "User already exists",
        "statusCode": 403,
        "errors": {
          "username": "User with that username already exists"
        }
      })
    }

    const user = await User.signup({ email, username, password, firstName, lastName });
    await setTokenCookie(res, user);

    // console.log(req)
    user.dataValues.token = req.cookies.token
    return res.json({
      user
    });
  }
);

module.exports = router;
