import {
  MANIFESTS_REMOVE_MANIFEST,
  FETCH_SAVED_MANIFESTS_SUCCESS
} from '../actions/manifestActions'

import {
  FETCH_FEED_CONTENT_SUCCESS,
  ARTICLES_MARK_READ
} from '../actions/articleActions'

export default (state = [], action) => {
  switch (action.type) {

    case 'RESET_APP':
      return []

    case FETCH_SAVED_MANIFESTS_SUCCESS:
      return [].concat(action.payload)
        .filter(manifestItem => !manifestItem.contentSnippet)
        .filter(manifestItem => !manifestItem.gaiaUrl)
        .filter(manifestItem => manifestItem.muted === true)

    case MANIFESTS_REMOVE_MANIFEST:
      return state.filter(stateItem => [].concat(action.payload)
        .filter(payloadItem => payloadItem.link === stateItem.link).length === 0
      )

    case ARTICLES_MARK_READ:
      return state.filter(stateItem => {
        return [].concat(action.payload).filter(payloadItem => payloadItem.link === action.payload.link).length !== 0
      })
      .concat([].concat(action.payload).map(payloadItem => {
        return {
          link: payloadItem.link,
          muted: true,
          feed: payloadItem.feed
        }
      })
    )

    // case FETCH_FEED_CONTENT_SUCCESS:
      // // remove items that no longer exist in payload feed
      // if (!action.payload.fetchedContent) {
      //   return state
      // }
      // return [].concat(action.payload.fetchedContent.items).length === 0 ?
      // state :
      // state.filter(
      //   stateItem => stateItem.feed.id !== action.payload.feed.id ?
      //   true :
      //   [].concat(action.payload.fetchedContent.items)
      //   .filter(payloadItem => payloadItem.link === stateItem.link)
      //   .length !== 0
      // ) || []

    default:
      return state
  }
}
  