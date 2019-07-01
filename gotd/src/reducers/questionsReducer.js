import _ from 'lodash';
import {
    FETCH_QUESTIONS,
    SIGN_IN
} from '../actions/types';

export default (state = [], action) => {
    switch (action.type) {
        case SIGN_IN:
           return { ...state, ..._.mapKeys(action.payload.questions, 'QuestionKey') };
        case FETCH_QUESTIONS:
            return { ...state, ..._.mapKeys(action.payload.questions, 'QuestionKey') };
        default:
            return state;
    }
}