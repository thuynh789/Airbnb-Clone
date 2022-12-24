const express = require("express");
const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require("../../db/models");
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
    .isLength({ min:1, max:50 })
    .withMessage("Name is required and must be less than 50 characters"),
  check("description")
    .notEmpty()
    .withMessage("Description is required"),
  check("price")
    .notEmpty()
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min:1, max:5})
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]

const validateBooking = [
    check("startDate")
        .isDate()
        .withMessage("startDate is not valid"),
    check("endDate")
        .isDate()
        .withMessage("endDate is not valid"),
    handleValidationErrors
  ]


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
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
    const { url, preview } = req.body
    const userId = req.user.id
    const spotId = req.params.spotId

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    // AUTHORIZATION
    if (userId !== spot.ownerId) {
        res.status(403);
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
        })
    }
    const newImage = await SpotImage.build({
        spotId, url, preview
    })
    await newImage.save()
    return res.json({
        'spotId': newImage.spotId,
        'url': newImage.url,
        'preview': newImage.preview
    })
})

//----GET /api/spots/current
router.get("/current", requireAuth, async (req, res, next) => {
    const userId = req.user.id
    const allSpots = await Spot.findAll({
        where: {
            ownerId: userId
        },
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


//----GET /api/spots/:spotId
router.get("/:spotId", async (req, res, next) => {
    const spotId = req.params.spotId

    const oneSpot = await Spot.findByPk(spotId, {
        include: [
            {
              model: Review,
              attributes: ["stars"],
            },
            {
              model: SpotImage,
              attributes: ["id", "url", "preview"],
            },
            {
              model: User,
              attributes: ["id", "firstName", "lastName"]
            }
        ]
    })

    if (!oneSpot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    const info = oneSpot.toJSON()
    let numReviews = 0
    let total = 0

    info.Reviews.forEach(review => {
        if(review.stars){
            numReviews++
            total += review.stars
        }
    })

    info.numReviews = numReviews
    if (!info.numReviews) {
        info.numReviews = 'No reviews'
    }
    info.avgStarRating = total/numReviews
    if (!info.avgStarRating) {
        info.avgStarRating = 'No ratings'
      }

    delete info.Reviews
    return res.json(info)
})

//----PUT /api/spots/:spotId
router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {
    const { spotId } = req.params
    const userId = req.user.id
    const updateSpot = await Spot.findByPk(spotId)
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    if (!updateSpot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    //AUTHORIZATION
    if (userId !== updateSpot.ownerId) {
        res.status(403);
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
        })
    }

    updateSpot.address = address
    updateSpot.city = city
    updateSpot.state = state
    updateSpot.country = country
    updateSpot.lat = lat
    updateSpot.lng = lng
    updateSpot.name = name
    updateSpot.description = description
    updateSpot.price = price

    await updateSpot.save()

    return res.json(updateSpot)
})

//----DELETE /api/spots/:spotId
router.delete("/:spotId", requireAuth, async (req, res, next) => {
    const { spotId } = req.params
    const userId = req.user.id

    const deleteSpot = await Spot.findByPk(spotId)

    if (!deleteSpot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    //AUTHORIZATION
    if (userId !== deleteSpot.ownerId) {
        res.status(403);
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
        })
    }
    await deleteSpot.destroy()
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

//----GET /api/spots/:spotId/reviews
router.get("/:spotId/reviews", async (req, res, next) => {
    const { spotId } = req.params

    const oneSpot = await Spot.findByPk(spotId)
    const spotReviews = await Review.findAll({
         where: {
            spotId: spotId
         },
         include: [
            {
              model: User,
              attributes: ["id", "firstName", "lastName"]
            },
            {
              model: ReviewImage,
              attributes: {
                exclude: ['reviewId', 'createdAt', 'updatedAt']
              }
            }
        ]
    })
    if (!oneSpot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    return res.json({Reviews: spotReviews})
})

//----POST /api/spots/:spotId/reviews
router.post("/:spotId/reviews", requireAuth, validateReview, async (req, res, next) => {
    const { review, stars } = req.body
    const userId = req.user.id
    const spotId = req.params.spotId

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    const findReview = await Review.findOne({
        where: {
            spotId: spotId,
            userId: userId
        }
    })
    if (findReview) {
        res.status(403);
        return res.json({
            "message": "User already has a review for this spot",
            "statusCode": 403
        })
    }
    const newReview = await Review.create({
        spotId, userId, review, stars
    })
    res.status(201)
    return res.json(newReview)
})

//----GET /api/spots/:spotId/bookings
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
    const { spotId } = req.params
    const userId = req.user.id

    const oneSpot = await Spot.findByPk(spotId)

    if (!oneSpot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    if (userId !== oneSpot.ownerId){
        const getBooking = await Booking.findAll({
            where: {
                spotId: spotId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })
       return res.json({Bookings: getBooking})
    } else {
        const myBooking = await Booking.findAll({
            where: {
                spotId: spotId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        })
        return res.json({Bookings: myBooking})
    }
})

//----POST /api/spots/:spotId/bookings
router.post("/:spotId/bookings", requireAuth, validateBooking, async (req, res, next) => {
    const { startDate, endDate } = req.body
    const userId = req.user.id
    const spotId = req.params.spotId

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404);
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    if (userId === spot.ownerId) {
        res.status(403);
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
        })
    }
    const newStartDate = new Date(startDate)
    const newEndDate = new Date(endDate)

    if (newEndDate<=newStartDate){
        res.status(400);
        return res.json({
            "message": "endDate cannot be on or before startDate",
            "statusCode": 400
        })
    }
    if (newStartDate < new Date()) {
        res.status(403);
        return res.json({
            "message": "Cannot create a booking in the past",
            "statusCode": 403
        })
    }
    const bookings = await Booking.findAll({
        where: {
            spotId: spotId,
        }
    })

    if (bookings){
        for (let i=0; i<bookings.length; i++){
            let currentStart = new Date(bookings[i].startDate)
            let currentEnd = new Date(bookings[i].endDate)
            let start = currentStart.getTime()
            let end = currentEnd.getTime()
            let givenStart = newStartDate.getTime()
            let givenEnd = newEndDate.getTime()

            if (givenStart >= start && givenEnd <= end){
                res.status(403)
                return res.json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "statusCode": 403,
                    "errors": {
                      "startDate": "Start date conflicts with an existing booking",
                      "endDate": "End date conflicts with an existing booking"
                    }
                })
            }
            if (givenStart>= start && givenStart<= end){
                res.status(403)
                return res.json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "statusCode": 403,
                    "errors": {
                      "startDate": "Start date conflicts with an existing booking"
                    }
                })
            }
            if (givenEnd>= start && givenEnd<= end){
                res.status(403)
                return res.json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "statusCode": 403,
                    "errors": {
                        "endDate": "End date conflicts with an existing booking"
                    }
                })
            }
        }
    }
    const newBooking = await Booking.create({
        spotId,
        userId,
        startDate: newStartDate,
        endDate: newEndDate
    })
    return res.json(newBooking)
})

module.exports = router;
