// import {
//   GAIA_LINKS_ADD_GAIA_LINK,
//   GAIA_LINKS_REMOVE_GAIA_LINK,
//   GAIA_LINKS_TOGGLE_GAIA_LINK,
//   FETCH_SAVED_GAIA_LINKS_SUCCESS,
//   FETCH_GAIA_LINKS_SUCCESS
// } from '../actions/gaiaLinkActions'

import {
  PUBLISH_ARTICLES_SUCCESS
} from '../actions/articleActions'

export default (state = [], action) => {
  switch (action.type) {
    case 'RESET_APP':
      return []

      case  PUBLISH_ARTICLES_SUCCESS:
        return state.concat(action.payload)

//     case GAIA_LINKS_ADD_GAIA_LINK:
//       return [
//         ...state.filter(gaiaLink => gaiaLink.id !== action.payload.id),
//         action.payload
//       ]
//     case GAIA_LINKS_REMOVE_GAIA_LINK:
//       return state.filter(stateItem => {
//         let payload = Array.isArray(action.payload) ? action.payload : [action.payload]
//         return payload.filter((payloadItem) => (payloadItem.id === stateItem.id)).length === 0
//       })

//     case GAIA_LINKS_TOGGLE_GAIA_LINK:
//       return state.map(gaiaLink => gaiaLink.id === action.payload.id ? { ...gaiaLink, muted: !gaiaLink.muted || false } : gaiaLink)

//     case FETCH_SAVED_GAIA_LINKS_SUCCESS:
//       return [].concat(action.payload)
      
//     case FETCH_GAIA_LINKS_SUCCESS:
//       return state.filter((stateItem) => !Array.isArray(stateItem))
//       .concat(action.payload.filter((payloadItem) => {
//         let itemExists = false
//         state.map((stateItem) => {
//           if (stateItem.id === payloadItem.id) {
//             itemExists = true
//           }
//           return 'o'
//         })
//         return !itemExists
//       }))
    default:
      return state
  }
}
  