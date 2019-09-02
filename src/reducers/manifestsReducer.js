import {
  MANIFESTS_REMOVE_MANIFEST,
  FETCH_SAVED_MANIFESTS_SUCCESS
} from '../actions/manifestActions'

import {
  PUBLISH_ARTICLE_SUCCESS
} from '../actions/articleActions'

export default (state = [], action) => {
  switch (action.type) {

    case 'RESET_APP':
      return []

    case FETCH_SAVED_MANIFESTS_SUCCESS:
      return [].concat(action.payload)

    case  PUBLISH_ARTICLE_SUCCESS:
      return [].concat(state).filter((stateItem) => stateItem.articleId !== action.payload.articleId).concat(action.payload)

    case MANIFESTS_REMOVE_MANIFEST:
      return state.filter(stateItem => action.payload.articleId !== stateItem.articleId)

    default:
      return state
  }
}
  