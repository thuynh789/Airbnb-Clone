import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneSpotThunk } from "../../store/spots"
import "./OneSpot.css"

function OneSpot() {
  const { spotId } = useParams()
  const thisSpot = useSelector((state) => state.spots.singleSpot);
  console.log(thisSpot)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
      dispatch(getOneSpotThunk(spotId))
    }, [dispatch])



  return (
    <div>
    </div>
  )
}

export default OneSpot;
