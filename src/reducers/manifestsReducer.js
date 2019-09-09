import {
  MANIFESTS_REMOVE_MANIFEST,
  FETCH_SAVED_MANIFESTS_SUCCESS
} from '../actions/manifestActions'

import {
  FETCH_ARTICLES_SUCCESS,
  ARTICLES_MARK_READ
} from '../actions/articleActions'

export default (state = [], action) => {
  switch (action.type) {

    case 'RESET_APP':
      return []

    case FETCH_SAVED_MANIFESTS_SUCCESS:
      return [].concat(action.payload)
        .filter(manifestItem => !manifestItem.contentSnippet)
        .filter(manifestItem => manifestItem.muted === true)

    case MANIFESTS_REMOVE_MANIFEST:
      return state.filter(stateItem => [].concat(action.payload)
        .filter(payloadItem => payloadItem.link === stateItem.link).length === 0
      )

    case ARTICLES_MARK_READ:
      return state.filter(stateItem => {
        return [].concat(action.payload).filter(payloadItem => payloadItem.link === action.payload.link).length !== 0
      })
      .filter(manifestItem => !manifestItem.contentSnippet)
      .filter(manifestItem => manifestItem.muted === true)
      .concat([].concat(action.payload).map(payloadItem => {
        return {
          link: payloadItem.link,
          muted: true,
          feed: payloadItem.feed
        }
      })
    )

    case FETCH_ARTICLES_SUCCESS:
      return state
        .filter(stateItem => stateItem.feed.id !== action.payload.feed.id)
        .filter(stateItem => !stateItem.contentSnippet)
        .filter(stateItem => stateItem.muted === true)
        .concat(
          state.filter(stateItem => stateItem.feed.id === action.payload.feed.id)
          .filter(stateItem => !!action.payload.articles
            .filter(payloadArticle => payloadArticle.link === stateItem.link)
          )
        )
        .concat(
          action.payload.articles.filter(payloadItem => {
            return [].concat(state).filter(stateItem => payloadItem.link === stateItem.link).length === 0
          })
        )


    default:
      return state
  }
}
  