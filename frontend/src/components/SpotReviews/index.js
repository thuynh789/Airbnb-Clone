import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { getSpotReviewsThunk } from "../../store/reviews";
import "./SpotReviews.css"

function SpotReviews() {
  const dispatch = useDispatch()
  const { closeModal } = useModal();
  const spotId = useSelector((state) => state.spots.singleSpot.id);

  useEffect(() => {
      dispatch(getSpotReviewsThunk(spotId))
    }, [dispatch, spotId])

  const spotReviews = useSelector(state => state.reviews.spot)
  const spotReviewArr = Object.values(spotReviews)
//   console.log(spotReviewArr)
  if (!spotReviewArr) return null

  return (
    <div className="reviews-wrapper">

         <div className="x-button">
            <button className="exit" onClick={closeModal}>
                x
                <i className="fa-solid fa-xmark" />
            </button>
        </div>

        <h2 className="review-header"> Reviews </h2>
        <div className="all-reviews">
            {spotReviewArr.map(review => (
                <div key={review.id} className="review">

                <div className="review-stuff">
                    <h4>{review.User.firstName}</h4>
                    <p>{review.stars} stars</p>
                    <p>{review.review}</p>
                </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default SpotReviews;
