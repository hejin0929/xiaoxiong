import { createStore, combineReducers } from 'redux';

const token = "";

const id = 123


function getToken(state = token, action) {
    switch (action.type) {
        case "setToken":
            return action.data;
        default:
            return state;
    }
}

function getDay(state = id, action) {
    switch (action.type) {
        case "setToken":
            return  action.data;
        default:
            return state;
    }
}




export const store = createStore(combineReducers({getToken, getDay}));