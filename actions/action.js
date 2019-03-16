/*
 * action types
 */

export const SET_TRIP_ID = 'SET_TRIP_ID'

/*
 * action creators
 */

export function setTripId(trip_id) {
    return { type: SET_TRIP_ID, trip_id: trip_id }
}