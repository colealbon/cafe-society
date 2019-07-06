import {
    FEED_UPDATE_FEED,
  } from '../actions/feedActions'
  
  export default (state = '', action) => {
    switch (action.type) {
      case FEED_UPDATE_FEED:
        return action.payload
      default:
        return state
    }
  }
  