import {
    FETCH_ACCOUNTS_SUCCESS
  } from '../actions/contractActions'
  
  export default (state = [], action) => {
    switch (action.type) {
      case FETCH_ACCOUNTS_SUCCESS:
        return action.payload
  
      default:
        return state
    }
  }
  