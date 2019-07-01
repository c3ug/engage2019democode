import _ from 'lodash';
import api from '../apis/qotd';
import history from '../history';
import { 
    LOG_IN,
    SIGN_IN,
    FETCH_RESULT,
    FETCH_QOTD,
    FETCH_QUESTIONS,
    SUBMIT_QOTD
} from './types';
import memoryStore from '../utils/memory-store';

var config = {headers: { 'Content-Type': 'application/json' }, auth: { 'username': 'your-username', 'password': 'your-password'}};
var token = "";

export const login = (source) => async dispatch => {
    const response = await api.get('/login', config);

    dispatch({ type: LOG_IN, payload: response.data});
    memoryStore.token = response.data.token;
    if (source === 'home') {
        history.push('/');
    }
}

export const signIn = (username) => async dispatch => {
    token = {headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + memoryStore.token }};
    const response = await api.post('/questionoftheday', { "UserName": username }, token);

    let responseData={...response.data, username: username};
    dispatch({ type: SIGN_IN, payload: responseData });

    if (response.data.response_key === "") {
        history.push('/qotd');
    } else {
        const qotd = response.data.documents[_.findIndex(response.data.documents)];
        const questionKey = qotd.QuestionKey;
        const getResponse = await api.get(`/resultsforquestionkey/${questionKey}`, token);
        
        dispatch({ type: FETCH_RESULT, payload: getResponse.data });
        history.push(`/result/${questionKey}`);
    }
};

export const fetchResult = (questionKey) => async dispatch => {
    
    token = {headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + memoryStore.token }};
    const response = await api.get(`/resultsforquestionkey/${questionKey}`, token);
    let payload_back = response.data;
    
    
    dispatch({ type: FETCH_RESULT, payload: payload_back });
    history.push(`/result/${questionKey}`);
}


export const fetchQotd = (questionKey) => async dispatch => {
    token = {headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + memoryStore.token }};
    const response = await api.get(`/resultsforquestionkey/${questionKey}`, token);
    
    dispatch({ type: FETCH_QOTD, payload: response.data});
    history.push(`/result/${questionKey}`);
};

export const fetchQuestions = () => async dispatch => {
    token = {headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + memoryStore.token }};
    const response = await api.get('/listquestionsoftheday', token);
    
    dispatch({ type: FETCH_QUESTIONS, payload: { questions: response.data.documents } });
    //history.push('/responses');
};

export const submitQotd = (submitData, questionKey) => async dispatch => {
    token = {headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + memoryStore.token }};
    const response = await api.post('/response', submitData, token);

    dispatch({ type: SUBMIT_QOTD, payload: response.data });
    history.push(`/result/${questionKey}`);
};