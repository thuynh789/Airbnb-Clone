const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Spot, Review, SpotImage, User } = require("../../db/models");
const router = express.Router();


module.exports = router;
