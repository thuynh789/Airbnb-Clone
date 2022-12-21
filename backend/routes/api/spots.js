const express = require("express");
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Spot, Review, SpotImage, User } = require("../../db/models");
const router = express.Router();

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
    .isLength({ min: 1, max: 50 })
    .withMessage("Name is required and must be less than 50 characters"),
  check("description")
    .notEmpty()
    .withMessage("Description is required"),
  check("price")
    .notEmpty()
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

//----GET /api/spots
router.get("/", async (req, res, next) => {
  const allSpots = await Spot.findAll({
    include: [
      {
        model: Review,
        attributes: ["stars", "spotId"],
      },
      {
        model: SpotImage,
        attributes: ["url", "preview"],
      },
    ],
  });

  let spotList = [];
  allSpots.forEach((spot) => {
    spotList.push(spot.toJSON());
  });

//average rating
  spotList.forEach((spot) => {
    let total = 0
    let count = 0
    spot.Reviews.forEach((review) => {
        total += review.stars
        count++
    })
    spot.avgRating = total/count
    if (!spot.avgRating) {
        spot.avgRating = "No ratings";
      }

//preview image
    spot.SpotImages.forEach((image) => {
      // console.log(image.preview)
      if (image.preview === true) {
        spot.previewImage = image.url;
      }
    });
    if (!spot.previewImage) {
      spot.previewImage = "No preview image";
    }

    //remove extra stuff
    delete spot.Reviews
    delete spot.SpotImages
  });
  return res.json({spotList});
});


//----POST /api/spots
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const ownerId = req.user.id
    const newSpot = await Spot.create({
        ownerId, address, city, state, country, lat, lng, name, description, price
    })
    if (newSpot) {
        res.status(201)
        return res.json(newSpot)
    }
})

//----POST /api/spots/:spotId/images
router.post("/:spotId/images", requireAuth, validateSpot, async (req, res, next) => {
    
})


module.exports = router;
