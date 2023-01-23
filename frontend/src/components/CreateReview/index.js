import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { createReviewThunk } from "../../store/reviews";
import { getOneSpotThunk } from "../../store/spots";
import "./CreateReview.css";

function CreateReview() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const spot = useSelector((state) => state.spots.singleSpot);
  const User = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);

  const [review, setReview] = useState('');
  const [stars, setStars] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    const newReview = {
      review,
      stars
    }

    const reviewExtras = {
        User,
        ReviewImages: [],

    }

    dispatch(createReviewThunk(spot.id, newReview, reviewExtras ))
    .then(() => dispatch(getOneSpotThunk(spot.id)))
    .then(() => history.push(`/spots/${spot.id}`))
    .then(closeModal)
    .catch(
      async (res) => {
        const data = await res.json();
        if (data && data.message) setErrors([data.message])
        // console.log(data)
      })
    }


    return (
    <div className="add-review-container">

      <div className="x-button">
        <div className="exit" onClick={closeModal}>
          x
          <i className="fa-solid fa-xmark" />
        </div>
      </div>

      <div className="header">
        Write A New Review
      </div>

      <div>
        <ul className="errors">
            {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      </div>


      <form className="form" onSubmit={handleSubmit}>
        <div className="form-parts">

          <label>
            <input
            className="form-part"
            placeholder="Review"
              type="text"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </label>

          <label>
            <input
            className="form-part"
            placeholder="Star Rating (1-5)"
              type="number"
              value={stars}
              onChange={(e) => setStars(e.target.value)}
              min='1'
              max='5'
              required
            />
          </label>

            <button className='submit-form' type="submit">Create new review</button>

        </div>
      </form>
    </div>

  );
}

export default CreateReview;
