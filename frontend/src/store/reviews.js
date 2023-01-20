import { csrfFetch } from "./csrf";

// constant action types
const GET_SPOT_REVIEWS = "spots/GET_SPOT_REVIEWS"
const GET_USER_REVIEWS = "spots/GET_USER_REVIEWS"
const ADD_REVIEW = "spots/ADD_REVIEW"
const DELETE_REVIEW = "spots/DELETE_REVIEW"

//ACTION CREATORS
export const getSpotReviewsAC = (reviews) => ({
	type: GET_SPOT_REVIEWS,
    reviews
})

export const getUserReviewsAC = (userReviews) => ({
    type: GET_USER_REVIEWS,
    userReviews
})

export const addReviewAC = (review) => ({
    type: ADD_REVIEW,
    review
})

export const deleteReviewAC = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})


//THUNKS
export const getSpotReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    if (res.ok) {
        const reviews = await res.json()
        dispatch(getSpotReviewsAC(reviews))
        return reviews
    }
}

//REDUCERS

const initialState = {
    spot: {},
    user: {},
}

export default function reviewReducer(state = initialState, action){
    switch (action.type) {


        case GET_SPOT_REVIEWS: {
            const newState = { spot: {}, user: {} }
            action.reviews.Reviews.forEach(review => {
                newState.spot[review.id] = review
            })
            return newState
        }


        default:
            return state
    }
}
