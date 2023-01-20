import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk } from "../../store/reviews";

const DeleteReview = ({ myReview }) => {
	const dispatch = useDispatch();
	const history = useHistory();
  const { closeModal } = useModal();
	const [errors, setErrors] = useState([]);
	const spot = useSelector((state) => state.spots.singleSpot);

	const handleSubmit = async (e) => {
       e.preventDefault();
       setErrors([]);



    dispatch(deleteReviewThunk(myReview.id))
      .then(() => history.push(`/spots/${spot.id}`))
      .then(closeModal)
      .catch(async (res) => {
        console.log(res)
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

return (
    <div className="delete-button-wrapper">
        <button className="delete-review" onClick={handleSubmit}>Delete Your Review</button>
    </div>
  )
};

export default DeleteReview;
