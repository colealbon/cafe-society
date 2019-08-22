// import * as blockstack from 'blockstack'

// var memoize = require("memoizee")

// const slowBlockstackGetFile = (filename, options) => {
//   return blockstack.getFile(filename, options)
// }
// const blockstackGetFile = memoize(slowBlockstackGetFile, { promise: true, maxAge: 10000 })

export const GAIA_LINKS_REMOVE_GAIA_LINK = 'GAIA_LINKS_REMOVE_GAIA_LINK'

export const removeGaiaLink = (removeGaiaLink, gaiaLinks) => {
  const removeGaiaLinks = [].concat(removeGaiaLink)
  return (dispatch) => {
    dispatch({
      type: GAIA_LINKS_REMOVE_GAIA_LINK,
      payload: removeGaiaLink
    })
    if (!!gaiaLinks && gaiaLinks !== undefined) {
      dispatch(publishGaiaLinks(gaiaLinks.filter(gaiaLinkItem => {
        return removeGaiaLinks.filter((removeGaiaLinkItem) => (removeGaiaLink.id === gaiaLinkItem.id)).length === 0
      })))
    }
  }
}

// export const GAIA_LINKS_MARK_READ = 'GAIA_LINKS_MARK_READ'

// const slowBlockstackPutFile = (filename, options) => {
//   return blockstack.putFile(filename, options)
// }
// const blockstackPutFile = memoize(slowBlockstackPutFile, { promise: true })

// export const markGaiaLinkRead = (gaiaLinks, allGaiaLinks) => {
//   return (dispatch) => {
//     dispatch({
//       type: GAIA_LINKS_MARK_READ,
//       payload: gaiaLinks
//     })
//     dispatch(publishGaiaLinks(allGaiaLinks.map(allGaiaLinksItem => {
//       let muteGaiaLink = [].concat(gaiaLinks).filter((payloadItem) => (payloadItem.id === allGaiaLinksItem.id)).length !== 0
//       return (muteGaiaLink === true) ? { ...allGaiaLinksItem, muted: true} : allGaiaLinksItem
//     })))
//   }
// }

export const GAIA_LINKS_TOGGLE_GAIA_LINK = 'GAIA_LINKS_TOGGLE_GAIA_LINK'

export const toggleGaiaLink = (gaiaLinks, allGaiaLinks) => {
  return (dispatch) => {
    dispatch({
      type: GAIA_LINKS_TOGGLE_GAIA_LINK,
      payload: gaiaLinks
    })
    dispatch(publishGaiaLinks(allGaiaLinks.map((stateGaiaLink) => {
      let gaiaLinkMatched = false
      gaiaLinks = [].concat(gaiaLinks)
      gaiaLinks.map((toggleGaiaLink) => {
        if (toggleGaiaLink.id === stateGaiaLink.id) {
          gaiaLinkMatched = true
        }
        return 'o'
      })
      return (gaiaLinkMatched === true ) ? { ...stateGaiaLink, muted: !stateGaiaLink.muted || false } : stateGaiaLink
    })))
  }
}

export const FETCH_GAIA_LINKS_START = 'FETCH_GAIA_LINKS_START'
export const FETCH_GAIA_LINKS_SUCCESS = 'FETCH_GAIA_LINKS_SUCCESS'
export const FETCH_GAIA_LINKS_FAIL = 'FETCH_GAIA_LINKS_FAIL'
export const FETCH_SAVED_GAIA_LINKS_SUCCESS = 'FETCH_SAVED_GAIA_LINKS_SUCCESS'
export const FETCH_SAVED_GAIA_LINK_SUCCESS = 'FETCH_SAVED_GAIA_LINK_SUCCESS'
export const FETCH_SAVED_GAIA_LINKS_FAIL = 'FETCH_SAVED_GAIA_LINKS_FAIL'
export const PUBLISH_GAIA_LINKS_START = 'PUBLISH_GAIA_LINKS_START'
export const PUBLISH_GAIA_LINK_SUCCESS = 'PUBLISH_GAIA_LINK_SUCCESS'
export const PUBLISH_GAIA_LINKS_FAIL = 'PUBLISH_GAIA_LINKS_FAIL'

export const publishGaiaLinks = (gaiaLinks) => {
  return (dispatch) => {
    dispatch({
      type: 'PUBLISH_GAIA_LINKS_START',
      payload: gaiaLinks
    })
  }
}