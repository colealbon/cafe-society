import * as blockstack from 'blockstack'
var memoize = require("memoizee")

const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { promise: true, maxAge: 10000 })


// export const FETCH_GAIA_LINKS_START = 'FETCH_GAIA_LINKS_START'
// export const FETCH_GAIA_LINKS_SUCCESS = 'FETCH_GAIA_LINKS_SUCCESS'
// export const FETCH_GAIA_LINKS_ERROR = 'FETCH_GAIA_LINKS_ERROR'
// export const FETCH_SAVED_GAIA_LINKS_SUCCESS = 'FETCH_SAVED_GAIA_LINKS_SUCCESS'
export const FETCH_SAVED_GAIA_LINK_SUCCESS = 'FETCH_SAVED_GAIA_LINK_SUCCESS'

export const FETCH_SAVED_GAIA_LINKS_ERROR = 'FETCH_SAVED_GAIA_LINKS_ERROR'
export const FETCH_SAVED_GAIA_LINKS_START = 'FETCH_SAVED_GAIA_LINKS_START'
export const FETCH_SAVED_GAIA_LINKS_SUCCESS = 'FETCH_SAVED_GAIA_LINKS_SUCCESS'

export const DELETE_GAIA_LINK_START = 'DELETE_GAIA_LINK_START'
export const DELETE_GAIA_LINK_SUCCESS = 'DELETE_GAIA_LINK_SUCCESS'
export const DELETE_GAIA_LINK_ERROR = 'DELETE_GAIA_LINK_ERROR'

export const GAIA_LINKS_REMOVE_GAIA_LINK = 'GAIA_LINKS_REMOVE_GAIA_LINK'


export const PUBLISH_GAIA_LINKS_START = 'PUBLISH_GAIA_LINKS_START'
export const PUBLISH_GAIA_LINKS_SUCCESS = 'PUBLISH_GAIA_LINKS_SUCCESS'
export const PUBLISH_GAIA_LINKS_ERROR = 'PUBLISH_GAIA_LINKS_ERROR'

export const publishGaiaLinks = (gaiaLinks) => {
  return (dispatch) => {
    dispatch({
      type: PUBLISH_GAIA_LINKS_START,
      payload: gaiaLinks
    })
    const fileContent = JSON.stringify(gaiaLinks)
    blockstack.putFile('gaiaLinks.json', fileContent)
    .then((response) => {
      dispatch({
        type: PUBLISH_GAIA_LINKS_SUCCESS,
        payload: {
          response: response,
          gaiaLinks: gaiaLinks
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: PUBLISH_GAIA_LINKS_ERROR,
        payload: {
          error: error
        }
      })
    })
  }
}

export const fetchBlockstackGaiaLinks = () => {
  return (dispatch) => {
    blockstackGetFile('gaiaLinks.json')
    .then((savedGaiaLinks) => {
      if (JSON.parse(savedGaiaLinks === null)) {
        return
      }
      dispatch({
        type: FETCH_SAVED_GAIA_LINKS_SUCCESS,
        payload: JSON.parse(savedGaiaLinks)
      })
    })
    .catch((error) => {
      dispatch({
        type: FETCH_SAVED_GAIA_LINKS_ERROR,
        payload: error
      })
    })
  }
}

export const removeGaiaLink = (removeGaiaLink, gaiaLinks) => {
  const removeGaiaLinks = [].concat(removeGaiaLink)
  return (dispatch) => {
    dispatch({
      type: GAIA_LINKS_REMOVE_GAIA_LINK,
      payload: removeGaiaLink
    })
    if (!!gaiaLinks) {
      dispatch(publishGaiaLinks(gaiaLinks.filter(gaiaLinkItem => {
        return removeGaiaLinks.filter((removeGaiaLinkItem) => (removeGaiaLinkItem.articleId === gaiaLinkItem.articleId)).length === 0
      })))
    }
    dispatch({
      type: DELETE_GAIA_LINK_START,
      payload: removeGaiaLink
    })
    blockstack.deleteFile(`${removeGaiaLink.sha1Hash}`)
    .then(() => dispatch(
      {type: DELETE_GAIA_LINK_SUCCESS}
    ))
    .catch((error) => {
      dispatch({
        type: DELETE_GAIA_LINK_ERROR,
        payload: error
      })
    })
  }
}