import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllSpotsThunk } from "../../store/spots"
import "./AllSpots.css"

function AllSpots() {
  const dispatch = useDispatch()
  const history = useHistory()
  const allSpots = useSelector(state => state.spots)
  const allSpotsArr = Object.values(allSpots)

  if (!allSpotsArr) return null


  useEffect(() => {
    dispatch(getAllSpotsThunk())
    }, [dispatch])


  return (
    <>
    <div className='button'>
      <div className='clickable-div' onClick={handleSubmit}>
        Demo User Login
      </div>
    </div>
    </>
  );
}

export default AllSpots;
