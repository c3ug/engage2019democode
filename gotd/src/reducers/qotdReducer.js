import _ from 'lodash';
import {
    SIGN_IN,
    SUBMIT_QOTD
} from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case SIGN_IN:
            return { ...state, ...action.payload.documents[_.findIndex(action.payload.documents)] };
        case SUBMIT_QOTD:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}