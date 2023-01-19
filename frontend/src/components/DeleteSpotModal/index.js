import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/spots";
import "./DeleteSpotModal.css"

const DeleteSpotModal = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { closeModal } = useModal();
	const [errors, setErrors] = useState([]);
	const spot = useSelector((state) => state.spots.singleSpot);

	const handleSubmit = async (e) => {
       e.preventDefault();
       setErrors([]);

     dispatch(deleteSpotThunk(spot.id))
      .then(() => history.push('/'))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

return (
    <div className="delete-wrapper">

        <div className="x-button">
            <button className="exit" onClick={closeModal}>
                x
                <i className="fa-solid fa-xmark" />
            </button>
        </div>

        <div className="header">
            <h2>Delete this listing?</h2>
            <p>(This is permanent and cannot be undone.)</p>
        </div>

        <div>
            <ul className="errors">
            {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
            ))}
            </ul>
        </div>

        <form className="delete-spot-form" onSubmit={handleSubmit}>
                <button className="confirm-delete-btn" type="submit">Confirm Delete</button>
        </form>

    </div>
  )
};

export default DeleteSpotModal;
