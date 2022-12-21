const express = require('express')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const { Spot, Review, SpotImage, User  } = require('../../db/models');


const validateSpot = [
    check("address")
        .notEmpty()
        .withMessage("Street address is required"),
    check("city")
        .notEmpty()
        .withMessage("City is required"),
    check("state")
        .notEmpty()
        .withMessage("State is required"),
    check("country")
        .notEmpty()
        .withMessage("Country is required"),
    check("lat")
        .notEmpty()
        .isDecimal()
        .withMessage("Latitude is not valid"),
    check("lng")
        .notEmpty()
        .isDecimal()
        .withMessage("Longitude is not valid"),
    check("name")
        .notEmpty()
        .isLength({ min: 1, max:50 })
        .withMessage("Name must be less than 50 characters"),
    check("description")
        .notEmpty()
        .withMessage("Description is required"),
    check("price")
        .notEmpty()
        .withMessage("Price per day is required"),
    handleValidationErrors
  ];

  //GET ALL SPOTS
  
