import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { addSpotThunk } from "../../store/spots";
import "./AddSpotModal.css";

function AddSpotModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState([]);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState(0.00);
  const [lng, setLng] = useState(0.00);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    const newSpot = {
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

    dispatch(addSpotThunk(newSpot, url))
    .then((res) => history.push(`/spots/${res.id}`))
    .then(closeModal)
    .catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors)
        // console.log(data)
        // console.log(errors)
      })
    }

    return (
    <div className="add-spot-container">

      <div className="x-button">
        <div className="exit" onClick={closeModal}>
          x
          <i className="fa-solid fa-xmark" />
        </div>
      </div>

      <div className="login">Create a listing</div>

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

          <label>
            <input
            className="form-part"
            placeholder="Preview Image URL"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              // required
            />
          </label>

            <button className='submit-button' type="submit">Create new listing</button>

        </div>
      </form>
    </div>

  );
}

export default AddSpotModal;
