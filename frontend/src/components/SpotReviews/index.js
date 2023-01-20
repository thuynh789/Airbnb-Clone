import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotReviewsThunk } from "../../store/reviews";
import "./SpotReviews.css"

function SpotReviews() {
  const dispatch = useDispatch()
  const { spotId } = useParams();

  useEffect(() => {
      dispatch(getSpotReviewsThunk(spotId))
    }, [dispatch, spotId])

  const spotReviews = useSelector(state => state.reviews.spot)
  const spotReviewArr = Object.values(spotReviews)
  console.log(spotReviewArr)
  if (!spotReviewArr) return null

  //   console.log(spotReviews)

  return (
    <div className="reviews-wrapper">
        <div className="all-reviews">
            {spotReviewArr.map(review => (
                <div key={review.id} className="review">
                <div></div>
                <div>{review.review}</div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default SpotReviews;
