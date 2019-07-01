import { LOG_IN } from '../actions/types';

export default (state = "", action) => {
    switch (action.type) {
        case LOG_IN:
            return {...state, token: action.payload.token };
        default:
            return state;
    }
}