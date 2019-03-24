/*
 * action types
 */

export const SET_TRIP_ID = 'SET_TRIP_ID'

/*
 * action creators
 */

export function setTripInfo({trip_id, amount_unit}) {
    return { 
        type: SET_TRIP_ID, 
        trip_id: trip_id,
        amount_unit: amount_unit
    }
}