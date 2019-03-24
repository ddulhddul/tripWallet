import { combineReducers } from 'redux'
import { SET_TRIP_ID } from '../actions/action'

function tripReducer(state = {}, action) {
    switch (action.type) {
        case SET_TRIP_ID:
            return {
                ...state, 
                trip_id: action.trip_id,
                amount_unit: action.amount_unit,
            }
        default:
            return state
    }
}

const reducer = combineReducers({
    tripReducer
})

export default reducer