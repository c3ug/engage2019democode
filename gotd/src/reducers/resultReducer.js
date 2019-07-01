import { FETCH_RESULT } from '../actions/types';

export default (state = [], action) => {
    switch (action.type) {
        case FETCH_RESULT:
            return {...state, ...action.payload };
        default:
            return state;
    }
}