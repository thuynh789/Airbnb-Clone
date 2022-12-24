const express = require("express");
const { setTokenCookie ,requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation")
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require("../../db/models");
const router = express.Router();

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



module.exports = router;
