import { csrfFetch } from "./csrf";

// constant action types
const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS"
const GET_SPOT = "spots/GET_SPOT"
const ADD_SPOT = "spots/ADD_SPOT"
const EDIT_SPOT = "spots/EDIT_SPOT"
const DELETE_SPOT = "spots/DELETE_SPOT"

//ACTION CREATORS
export const getAllSpotsAC = (spots) => ({
	type: GET_ALL_SPOTS,
    spots
})

export const getSpotAC = (spot) => ({
    type: GET_SPOT,
    spot
})

export const addSpotAC = (spot) => ({
    type: ADD_SPOT,
    spot
})

export const editSpotAC = (spot) => ({
    type: EDIT_SPOT,
    spot
})

export const deleteSpotAC = (spotId) => ({
    type: DELETE_SPOT,
    spotId

})

//THUNKS
export const getAllSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    if (res.ok) {
        const spots = await res.json()
        dispatch(getAllSpotsAC(spots))
        return spots
    }
}

export const getOneSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)
    if (res.ok) {
        const spot = await res.json()
        dispatch(getSpotAC(spot))
        return spot
    }
}

export const addSpotThunk = (newSpot, url) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpot)
    })
    if (res.ok) {
        const spotInfo = await res.json();

        const spotImageRes = await csrfFetch(`/api/spots/${spotInfo.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, preview: true }),
        });
        if (spotImageRes.ok) {
            const spotImage = await spotImageRes.json()
            spotInfo.previewImage = spotImage.url
            dispatch(addSpotAC(spotInfo))
            return spotInfo
        }
    }
  return res
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        const deletedSpot = await res.json()
        dispatch(deleteSpotAC(spotId))
        return deletedSpot
    }
}

export const editSpotThunk = (editedSpot, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedSpot)
    })
    if (res.ok) {
        const updatedSpot = await res.json()
        dispatch(editSpotAC(updatedSpot))
        return updatedSpot
    }
}

//REDUCERS

const initialState = {
    allSpots: {},
    singleSpot: {},
}

export default function spotReducer(state = initialState, action){
    switch (action.type) {


        case GET_ALL_SPOTS: {
            const newState = { allSpots: {}, singleSpot: {} }
            action.spots.Spots.forEach(spot => {
                newState.allSpots[spot.id] = spot
            })
            return newState
        }

        case GET_SPOT: {
            const newState = { ...state, singleSpot: {} }
            newState.singleSpot = action.spot
            return newState
        }

        case ADD_SPOT: {
            const newState = { ...state, singleSpot:{} }
            newState.allSpots[action.spot.id] = action.spot
            return newState
        }

        case DELETE_SPOT: {
            const newState = { ...state, singleSpot: {} }
            delete newState.allSpots[action.spotId]
            return newState
        }

        case EDIT_SPOT: {
            const newState = { ...state, singleSpot: {} }
            newState.allSpots[action.spot.id] = action.spot
            newState.singleSpot = action.spot
            return newState
        }

        default:
            return state
    }
}
