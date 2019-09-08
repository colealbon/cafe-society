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
        // delete obsolete manifests
        //   manifests.filter((manifest) => manifest.articleId === articleItem.articleId)
        //   .filter((manifest) => (manifest.sha1Hash !== sha1Hash))
        //   .map(manifest => {
        //     if (!manifest) {
        //       return 'o'
        //     }      
        
        
        // CREATE NEW MANIFESTS add this one   
        // const theManifest = {
        //   link: articleItem.link,
        //   articleId: articleItem.articleId,
        //   muted: articleItem.muted,
        //   salt: articleItem.salt,
        //   date: theDate,
        //   sha1Hash: sha1Hash,
        // }
        // dispatch({
        //   type: 'PUBLISH_ARTICLE_SUCCESS',
        //   payload: thManifest
        // })

    default:
      return state
  }
}
  