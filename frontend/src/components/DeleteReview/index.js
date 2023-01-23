import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk } from "../../store/reviews";
import { getOneSpotThunk } from "../../store/spots";
import "./DeleteReview.css"

const DeleteReview = ({ myReview }) => {
	const dispatch = useDispatch();
	const history = useHistory();
  const { closeModal } = useModal();
	const spot = useSelector((state) => state.spots.singleSpot);

	const handleSubmit = async (e) => {
       e.preventDefault();

    dispatch(deleteReviewThunk(myReview.id))
      .then(() => dispatch(getOneSpotThunk(spot.id)))
      .then(() => history.push(`/spots/${spot.id}`))
      .then(closeModal)
  };

return (
    <div className="delete-button-wrapper">
        <button className="delete-review" onClick={handleSubmit}>Delete Review</button>
    </div>
  )
};

export default DeleteReview;
