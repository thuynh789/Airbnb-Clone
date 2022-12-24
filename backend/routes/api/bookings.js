const express = require("express");
const { setTokenCookie ,requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation")
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require("../../db/models");
const router = express.Router();

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

//----GET /api/bookings/current
router.get("/current", requireAuth, async (req, res, next) => {
    const userId = req.user.id
    const allBookings = await Booking.findAll({
        where: {
            userId: userId
        },
        include: [
          {
            model: Spot,
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt']
            },
            include: [
                {
                    model: SpotImage,
                    attributes: ['url', 'preview']
                }
            ]
          },
        ],
      });

      let bookingList = [];
      allBookings.forEach((booking) => {
        bookingList.push(booking.toJSON());
      });

      bookingList.forEach((booking) => {
        booking.Spot.SpotImages.forEach((image) => {
            if (image.preview === true){
                booking.previewImage = image.url
            }
        })
        if (!booking.previewImage){
            booking.previewImage = 'No preview'
        }
        delete booking.Spot.SpotImages
    })
    return res.json({Bookings:bookingList})
})

//----PUT /api/bookings/:bookingId
router.put("/:bookingId", requireAuth, validateReview, async (req, res, next) => {
    const { bookingId } = req.params
    const userId = req.user.id
    const { startDate, endDate } = req.body
    const newStartDate = new Date(startDate)
    const newEndDate = new Date(endDate)

    const updateBooking = await Booking.findByPk(bookingId)

    if (!updateBooking) {
        res.status(404);
        return res.json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }
    //AUTHORIZATION
    if (userId !== updateBooking.userId) {
        res.status(403);
        return res.json({
            "message": "Forbidden",
            "statusCode": 403
        })
    }

    if (newEndDate<=newStartDate){
        res.status(400);
        return res.json({
            "message": "endDate cannot be on or before startDate",
            "statusCode": 400
        })
    }
    if (updateBooking.endDate < new Date()) {
        res.status(403);
        return res.json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        })
    }

    const bookings = await Booking.findAll({
        where: {
            spotId: updateBooking.spotId,
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

    updateBooking.startDate = newStartDate
    updateBooking.endDate = newEndDate

    await updateBooking.save()

    return res.json(updateBooking)
  })

module.exports = router;
