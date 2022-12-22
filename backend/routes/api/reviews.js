const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Spot, Review, SpotImage, User, ReviewImage } = require("../../db/models");
const router = express.Router();

//----GET /api/reviews/current
router.get("/current", requireAuth, async (req, res, next) => {
    const userId = req.user.id
    const allReviews = await Review.findAll({
        where: {
            userId: userId
        },
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
          },
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
          {
            model: ReviewImage,
            attributes: ['id', 'url']
          }
        ],
      });

      let reviewList = [];
      allReviews.forEach((review) => {
        reviewList.push(review.toJSON());
      });

      reviewList.forEach((review) => {
        review.Spot.SpotImages.forEach((image) => {
            if (image.preview === true){
                review.previewImage = image.url
            }
        })
        if (!review.previewImage){
            review.previewImage = 'No preview'
        }
        delete review.Spot.SpotImages
    })
    return res.json({reviewList})
})
module.exports = router;
