import {
  FEED_UPDATE_FEED,
  FEEDS_TOGGLE_FEED
} from '../actions/feedActions'

const initialState = {url: ''}

export default (state = initialState, action) => {
  switch (action.type) {
    case FEED_UPDATE_FEED:
        return { ...state, ...action.payload }
        case FEED_UPDATE_FEED:
            return { ...state, ...action.payload }
    default:
        return state
  }
}
