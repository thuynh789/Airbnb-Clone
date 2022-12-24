const express = require("express");
const { setTokenCookie ,requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation")
const { Spot, Review, SpotImage, User, ReviewImage } = require("../../db/models");
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

      bookingList.forEach((review) => {
        review.Spot.SpotImages.forEach((image) => {
            if (image.preview === true){
                review.previewImage = image.url
            }
        })
        if (!review.previewImage){
            review.previewImage = 'No preview'
        }
        if (review.ReviewImages.length === 0){
            review.ReviewImages = 'No review images'
        }
        delete review.Spot.SpotImages
    })
    return res.json({Reviews:reviewList})
})

module.exports = router;
