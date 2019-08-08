import {
    FETCH_USER_DATA,
    USER_LOGIN,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_HANDLE_LOGIN,
    USER_LOGGED_IN,
    USER_LOGIN_ERROR
  } from '../actions/blockstackUserActions';
  
  import {
    PUBLISH_FEEDS_SUCCESS
  } from '../actions/feedActions'

  import {
    PUBLISH_FILTERS_SUCCESS
  } from '../actions/filterActions'

  import {
    PUBLISH_CONTACTS_SUCCESS
  } from '../actions/contactActions'

  import {
    PUBLISH_ARTICLES_SUCCESS
  } from '../actions/articleActions'

  const initialState = {
    isAuthenticated: false,
    isLoginPending: false,
    profile: {},
    error: null
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case FETCH_USER_DATA:
        return action.payload
      case USER_LOGIN:
        return { ...state, isLoginPending: true }
      case USER_LOGIN_SUCCESS:
        return { ...state, isAuthenticated: true }
      case USER_LOGOUT:
        return { ...initialState }
      case USER_HANDLE_LOGIN:
        return { ...state, isLoginPending: false }
      case USER_LOGGED_IN:
        return {
          ...state,
          isAuthenticated: true,
          isLoginPending: false,
          profile: action.payload
        };
      case USER_LOGIN_ERROR:
        return { ...state, error: action.payload }
      case PUBLISH_FEEDS_SUCCESS:
        return {...state, feedsUrl: action.payload.response}
      case PUBLISH_FILTERS_SUCCESS:
          return {...state, filtersUrl: action.payload.response}
      case PUBLISH_CONTACTS_SUCCESS:
        return {...state, contactsUrl: action.payload.response}
      case PUBLISH_ARTICLES_SUCCESS:
        return {...state, articlesUrl: action.payload.response}
      default:
        return state
    }
  }
  