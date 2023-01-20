import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneSpotThunk } from "../../store/spots";
import "./OneSpot.css";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import EditSpotModal from "../EditSpotModal";
import SpotReviews from "../SpotReviews";

function OneSpot() {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.singleSpot);
  const dispatch = useDispatch();
  const history = useHistory();

  const spotImages = spot?.SpotImages
  const spotPics = spotImages?.find(pic => pic.preview === true)

  const host = useSelector((state) => state.spots.singleSpot.User?.firstName)
  const user = useSelector((state) => state.session.user)

//   const spotReviews = useSelector((state) => state.Reviews);
//   console.log(spotReviews)

  useEffect(() => {
    dispatch(getOneSpotThunk(spotId))
    .catch(() => history.push('/'));
  }, [dispatch, spotId, history]);

  if (!spot) return null;

  return (
    <div className="spot-wrapper-page">

      <h1 className="spot-name">{spot.name}</h1>
      <div className="spot-header">
        <div className="rating">
            <i className="fa fa-star"/>
            {spot.avgStarRating} • {spot.numReviews} reviews
        </div>
        <p className="location">{spot.city}, {spot.state}, {spot.country}</p>
      </div>

        <div className="spot-image">
          <img
            className="spot-first-image"
            src={spotPics?.url}
            alt='no image found'
          />
        </div>

        <div className="bottom-left">
            <div className="description">
                <h2 className="title">Amazing place hosted by {host}</h2>
                <p>Property description: {spot.description}</p>
            </div>
            <div className="amenities">
            </div>
            <div className="reviews-area">
                <div className="reviews-area-header">
                    <h3><i className="fa fa-star"/>
                    {spot.avgStarRating} • {spot.numReviews} reviews </h3>
                </div>
            </div>
        </div>

        <div className="Reviews">
            <OpenModalButton
              buttonText="See Reviews"
              modalComponent={<SpotReviews/>}
            />
        </div>

        <div className="user-specific-buttons">
        {spot.ownerId === user?.id && (
          <div className="buttons">

          <div className="delete-button">
            <OpenModalButton
              buttonText="Delete Listing"
              modalComponent={<DeleteSpotModal />}
            />
          </div>

          <div className="edit-button">
            <OpenModalButton
              buttonText="Edit Listing"
              modalComponent={<EditSpotModal/>}
            />
          </div>
          </div>
        )}
        </div>

    </div>
  );
}

export default OneSpot;
