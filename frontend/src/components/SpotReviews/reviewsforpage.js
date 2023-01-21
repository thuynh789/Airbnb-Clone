import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useModal } from "../../context/Modal";
import { getSpotReviewsThunk } from "../../store/reviews";
import DeleteReview from "../DeleteReview";
import "./SpotReviews.css"

function ReviewsForPage() {
  const dispatch = useDispatch()
  // const { closeModal } = useModal();
  const spot = useSelector((state) => state.spots.singleSpot);
  const user = useSelector((state) => state.session.user);


  useEffect(() => {
      dispatch(getSpotReviewsThunk(spot.id))
    }, [dispatch, spot.id])

  const spotReviews = useSelector(state => state.reviews.spot)
  const spotReviewArr = Object.values(spotReviews)
//   console.log(spotReviewArr)
  if (!spotReviewArr) return null

  return (
    <div className="reviews-wrapper">

         {/* <div className="x-button">
            <button className="exit" onClick={closeModal}>
                x
                <i className="fa-solid fa-xmark" />
            </button>
        </div> */}
{/*
        <div className="rating">
            <i className="fa fa-star"/>
            {spot.avgStarRating} • {spot.numReviews} reviews
        </div> */}

        <div className="all-reviews">
            {spotReviewArr.map(review => (
                <div key={review.id} className="review">

                <div className="review-stuff">
                  <i className="fas fa-user-circle"/> &nbsp;&nbsp;
                    {review.User.firstName}
                    <p>{review.stars} stars</p>
                    <p>{review.review}</p>
                </div>

                <div className="delete-review-wrapper">
                {/* OWNER OF REVIEW */}
                  {user && user.id === review?.userId && (
                  <div className="delete-review">
                    <DeleteReview myReview = {review} />
                  </div>
                  )}
                </div>

                </div>
            ))}
        </div>

    </div>
  )
}

export default ReviewsForPage;
