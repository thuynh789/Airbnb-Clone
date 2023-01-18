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
        
        default:
            return state
    }
}
