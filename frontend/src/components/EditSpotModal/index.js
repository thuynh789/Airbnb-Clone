import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { editSpotThunk } from "../../store/spots";
import "./EditSpotModal.css"

const EditSpotModal = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { closeModal } = useModal();
	const [errors, setErrors] = useState([]);
    const spotInfo = useSelector((state) => state.spots.singleSpot);
    const { SpotImages, User, avgStarRating, numReviews } = spotInfo

    // console.log(spotInfo)

    const [address, setAddress] = useState(spotInfo.address);
    const [city, setCity] = useState(spotInfo.city);
    const [state, setState] = useState(spotInfo.state);
    const [country, setCountry] = useState(spotInfo.country);
    const [lat, setLat] = useState(0.00);
    const [lng, setLng] = useState(0.00);
    const [name, setName] = useState(spotInfo.name);
    const [description, setDescription] = useState(spotInfo.description);
    const [price, setPrice] = useState(spotInfo.price);
    const [url, setUrl] = useState('');

	const handleSubmit = async (e) => {
       e.preventDefault();
       setErrors([]);

       const editedSpot = {
        id: spotInfo.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      }

      const spotExtras = { SpotImages, User, avgStarRating, numReviews }

   dispatch(editSpotThunk(editedSpot, spotExtras))
      .then(() => history.push(`/spots/${spotInfo.id}`))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

return (
    <div className="edit-wrapper">

        <div className="x-button">
            <div className="exit" onClick={closeModal}>
                x
                <i className="fa-solid fa-xmark" />
            </div>
        </div>

        <div className="header">Edit listing</div>

        <div>
            <ul className="errors">
            {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
            ))}
            </ul>
        </div>

        <form className="edit-spot-form" onSubmit={handleSubmit}>
            <div className="form-parts">

            <label>
            <input
            className="form-part"
            placeholder="Street Address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              // required
            />
          </label>

          <label>
            <input
            className="form-part"
            placeholder="City"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              // required
            />
          </label>

          <label>
            <input
            className="form-part"
            placeholder="State"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              // required
            />
          </label>

          <label>
            <input
            className="form-part"
            placeholder="Country/Region"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              // required
            />
          </label>

          <label>
            <input
            className="form-part"
            placeholder="Property name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // required
            />
          </label>

          <label>
            <input
            className="form-part"
            placeholder="Description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              // required
            />
          </label>

          <label>
            <input
            className="form-part"
            placeholder="Price per night"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              // required
            />
          </label>
                <button className="confirm-edit-btn" type="submit">Confirm edits</button>
            </div>
        </form>

    </div>
  )
};

export default EditSpotModal;
