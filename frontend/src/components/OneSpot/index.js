import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneSpotThunk } from "../../store/spots";
import "./OneSpot.css";

function OneSpot() {
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.singleSpot);
  const dispatch = useDispatch();
  const history = useHistory();

  const spotImages = spot?.SpotImages
  const spotPics = spotImages?.find(pic => pic.preview === true)

  useEffect(() => {
    dispatch(getOneSpotThunk(spotId)).catch(() => history.push("/"));
  }, [dispatch, spotId, history]);

  if (!spot) return null;

  return (
    <div className="spot-wrapper-page">

      <h1 className="spot-name">{spot.name}</h1>
      <div className="spot-header">
        <div className="rating">
            <i className="fa fa-star"/>
            {spot.avgStarRating}
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

    </div>
  );
}

export default OneSpot;
