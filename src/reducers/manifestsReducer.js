import {
  MANIFESTS_REMOVE_MANIFEST,
  FETCH_SAVED_MANIFESTS_SUCCESS,
  PUBLISH_MANIFESTS_SUCCESS

} from '../actions/manifestActions'

import {
  FETCH_ARTICLES_SUCCESS,
  ARTICLES_MARK_READ
} from '../actions/articleActions'

export default (state = [], action) => {
  switch (action.type) {

    case 'RESET_APP':
      return []

  case PUBLISH_MANIFESTS_SUCCESS:
    return action.payload.manifests

    case FETCH_SAVED_MANIFESTS_SUCCESS:
      return [].concat(action.payload)
    
    case ARTICLES_MARK_READ:
      return state.map(stateItem => {
        return {
          ...stateItem,
          muted: [].concat(action.payload).filter(payloadItem => payloadItem.link === stateItem.link).length === 0 ?
          stateItem.muted :
          true
        }
      })

    case MANIFESTS_REMOVE_MANIFEST:
      return state.filter(stateItem => !action.payload
        .filter(payloadItem => payloadItem.link === stateItem.link)
      )

    case FETCH_ARTICLES_SUCCESS:
      return state
        .filter(stateItem => stateItem.feed.id !== action.payload.feed.id)
        .concat(
          state.filter(stateItem => stateItem.feed.id === action.payload.feed.id)
          .filter(stateItem => !!action.payload.articles
            .filter(payloadArticle => payloadArticle.link === stateItem.link)
          )
        )
        .concat(
          action.payload.filter(payloadItem => {
            return state.filter(stateItem => payloadItem.link === stateItem.link).length === 0
          }).map(payloadItem => {
            return {
              link: payloadItem.link,
              muted: payloadItem.muted || false,
              feed: payloadItem.feed
            }
          })
        )

    default:
      return state
  }
}
  