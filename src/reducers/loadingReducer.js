import {
  PUBLISH_ARTICLES_REQUEST,
  PUBLISH_ARTICLES_SUCCESS,
  FETCH_ARTICLES_REQUEST,
  FETCH_ARTICLES_SUCCESS,
  FETCH_ARTICLES_ERROR
} from '../actions/articleActions'

const initialState = {
  loading: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case PUBLISH_ARTICLES_REQUEST:
      return true
    case PUBLISH_ARTICLES_SUCCESS:
      return false
    case FETCH_ARTICLES_REQUEST:
      return true
    case FETCH_ARTICLES_SUCCESS:
      return false
    case FETCH_ARTICLES_ERROR:
      return false
    default:
      return state
  }
}
