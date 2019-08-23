import {
  GAIA_LINKS_REMOVE_GAIA_LINK,
  FETCH_SAVED_GAIA_LINK_SUCCESS,
} from '../actions/gaiaLinkActions'

import {
  PUBLISH_ARTICLE_SUCCESS
} from '../actions/articleActions'

export default (state = [], action) => {
  switch (action.type) {

    case 'RESET_APP':
      return []

    case  PUBLISH_ARTICLE_SUCCESS:
      return state.filter((stateItem) => stateItem.articleId !== action.payload.articleId).concat(action.payload)

    case GAIA_LINKS_REMOVE_GAIA_LINK:
      return state.filter(stateItem => action.payload.articleId !== stateItem.articleId)
      
    case FETCH_SAVED_GAIA_LINK_SUCCESS:
      return state.filter(stateItem => stateItem.articleId !== action.payload.articleId).concat(action.payload)

    default:
      return state
  }
}
  