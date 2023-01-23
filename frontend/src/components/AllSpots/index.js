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

  const allSpots = useSelector(state => state.spots.allSpots)
  const allSpotsArr = Object.values(allSpots)
  if (!allSpotsArr) return null


  return (
    <div className="spots-wrapper">
        <div className="all-spots">
            {allSpotsArr.map(spot => (
                <div key={spot.id} className="spots-card" onClick={() => history.push(`/spots/${spot.id}`)}>
                    <div className="spots-card-wrapper">
                        <img
                            className="spots-image"
                            src={spot.previewImage}
                            alt={spot.name}
                        />
                    </div>
                    <div className="spots-details-wrapper">
                        <div className="spots-details">
                            <p className="location">{spot.city}, {spot.state}</p>
                            <div className="rating">
                                <i className="fa fa-star"/>
                                 &nbsp; {spot.avgRating}
                            </div>
                        </div>
                    </div>
                            <div className= 'spot-price'>
                                <span className="price">${spot.price}&nbsp;</span>
                                <span>night</span>
                            </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default AllSpots;
