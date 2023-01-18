import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllSpotsThunk } from "../../store/spots"
import "./AllSpots.css"

function AllSpots() {
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
      dispatch(getAllSpotsThunk())
    }, [dispatch])

  const allSpots = useSelector(state => state.spots)
  const allSpotsArr = Object.values(allSpots).filter(spot => Object.keys(spot).length !== 0)
  if (!allSpotsArr) return null


  return (
    <div className="spots-wrapper">
        <div className="all-spots">
            {allSpotsArr.map(spot => (
                <div key={spot.id} className="spots-card">
                    <div className="spots-card-wrapper">
                        <img
                            className="spots-image"
                            src={spot.previewImage}
                            alt={spot.name}
                            onClick={() => history.push(`/spots/${spot.id}`)}
                        />
                    </div>
                    <div className="spots-details-wrapper">
                        <div className="spots-details">
                            <p className="location">{spot.city}, {spot.state}</p>
                            <p className="rating">{spot.avgRating}</p>
                            <p className="price">${spot.price} night</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default AllSpots;
