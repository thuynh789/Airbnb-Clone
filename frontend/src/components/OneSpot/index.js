import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneSpotThunk } from "../../store/spots"
import "./OneSpot.css"

function OneSpot() {
  const { spotId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
      dispatch(getOneSpotThunk(spotId))
    }, [dispatch])

  const allSpots = useSelector(state => state.spots.allSpots)
  const allSpotsArr = Object.values(allSpots)
  if (!allSpotsArr) return null


  return (
    <div>
    </div>
  )
}

export default OneSpot;
