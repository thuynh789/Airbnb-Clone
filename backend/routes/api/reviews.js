const express = require("express");
const { setTokenCookie ,requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { validateReview } = require('./spots')
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
        if (review.ReviewImages.length === 0){
            review.ReviewImages = 'No review images'
        }
        delete review.Spot.SpotImages
    })
    return res.json({Reviews:reviewList})
})


//----POST /api/reviews/:reviewId/images
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const { url } = req.body
  const userId = req.user.id
  const reviewId = req.params.reviewId

  const review = await Review.findByPk(reviewId)

  if (!review) {
      res.status(404);
      return res.json({
          "message": "Review couldn't be found",
          "statusCode": 404
      })
  }
  // AUTHORIZATION
  if (userId !== review.userId) {
      res.status(403);
      return res.json({
          "message": "Forbidden",
          "statusCode": 403
      })
  }
  const getImages = await ReviewImage.findAll({
    where: {
      reviewId: reviewId
    }
  })
  if (getImages.length >= 10){
    res.status(403);
    return res.json({
        "message": "Maximum number of images for this resource was reached",
        "statusCode": 403
    })
  }
  const newImage = await ReviewImage.build({
      reviewId, url
  })
  await newImage.save()
  return res.json({
      'id': newImage.id,
      'url': newImage.url
  })
})

//----PUT /api/reviews/:reviewId
router.put("/reviews/:reviewId", requireAuth, validateReview, async (req, res, next) => {
  const { reviewId } = req.params
  const userId = req.user.id
  const updateReview = await Review.findByPk(reviewId)
  const { review, stars } = req.body

  if (!updateReview) {
      res.status(404);
      return res.json({
          "message": "Review couldn't be found",
          "statusCode": 404
      })
  }
  //AUTHORIZATION
  if (userId !== updateReview.userId) {
      res.status(403);
      return res.json({
          "message": "Forbidden",
          "statusCode": 403
      })
  }
  updateReview.review = review
  updateReview.stars = stars

  await updateReview.save()

  return res.json(updateReview)
})

//----DELETE /api/reviews/:reviewId
router.delete("/reviews/:reviewId", requireAuth, async (req, res, next) => {
  const { reviewId } = req.params
  const userId = req.user.id

  const deleteReview = await Review.findByPk(reviewId)

  if (!deleteReview) {
      res.status(404);
      return res.json({
          "message": "Review couldn't be found",
          "statusCode": 404
      })
  }
  //AUTHORIZATION
  if (userId !== deleteReview.userId) {
      res.status(403);
      return res.json({
          "message": "Forbidden",
          "statusCode": 403
      })
  }
  await deleteReview.destroy()
  return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
  })
})

module.exports = router;
