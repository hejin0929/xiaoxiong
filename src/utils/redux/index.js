import { createStore, combineReducers } from 'redux';

const token = localStorage.getItem("token");


function getToken(state = token, action) {
    switch (action.type) {
        case "refresh":
            return localStorage.getItem("token");
        case "clearToken":
            return null;
        default:
            return state;
    }
}

function getValidTime(state = 30, action) {
    switch (action.type) {
        case "setValidTime":
            return state - 1;
        case "activate":
            return 30000;
        default:
            return state;
    }
}




export const store = createStore(combineReducers({ getToken, getValidTime }));