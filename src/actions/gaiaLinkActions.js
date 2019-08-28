import * as blockstack from 'blockstack'

var memoize = require("memoizee")

export const FETCH_GAIA_LINKS_START = 'FETCH_GAIA_LINKS_START'
export const FETCH_GAIA_LINKS_SUCCESS = 'FETCH_GAIA_LINKS_SUCCESS'
export const FETCH_GAIA_LINKS_ERROR = 'FETCH_GAIA_LINKS_ERROR'
export const FETCH_SAVED_GAIA_LINKS_SUCCESS = 'FETCH_SAVED_GAIA_LINKS_SUCCESS'
export const FETCH_SAVED_GAIA_LINK_SUCCESS = 'FETCH_SAVED_GAIA_LINK_SUCCESS'
export const FETCH_SAVED_GAIA_LINKS_ERROR = 'FETCH_SAVED_GAIA_LINKS_ERROR'
export const PUBLISH_GAIA_LINKS_START = 'PUBLISH_GAIA_LINKS_START'
export const PUBLISH_GAIA_LINKS_SUCCESS = 'PUBLISH_GAIA_LINKS_SUCCESS'
export const PUBLISH_GAIA_LINKS_ERROR = 'PUBLISH_GAIA_LINKS_ERROR'
export const PUBLISH_GAIA_LINK_SUCCESS = 'PUBLISH_GAIA_LINK_SUCCESS'
export const PUBLISH_GAIA_LINKS_FAIL = 'PUBLISH_GAIA_LINKS_FAIL'
export const GAIA_LINKS_REMOVE_GAIA_LINK = 'GAIA_LINKS_REMOVE_GAIA_LINK'

export const removeGaiaLink = (gaiaLink, gaiaLinks) => {
  return (dispatch) => {
    dispatch({
      type: GAIA_LINKS_REMOVE_GAIA_LINK,
      payload: gaiaLink
    })
    dispatch({
      type: 'DELETE_GAIA_LINK_START',
      payload: gaiaLink
    })
    blockstack.deleteFile(`${gaiaLink.sha1Hash}`)
    .then(() => dispatch(
      {type: 'DELETE_GAIA_LINK_SUCCESS'}
    ))
    .catch((error) => {
      dispatch({
        type: 'DELETE_GAIA_LINK_FAIL',
        payload: error
      })
    })
  }
}


export const publishGaiaLinks = (gaiaLinks) => {
  if (!!gaiaLinks) {
    return (dispatch) => {
      dispatch({
        type: PUBLISH_GAIA_LINKS_START,
        payload: gaiaLinks
      })
      const fileContent = JSON.stringify(gaiaLinks)
      return blockstack.putFile('gaiaLinks.json', fileContent)
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
}


const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { promise: true, maxAge: 10000 })

export const fetchBlockstackGaiaLinks = (gaiaLinks) => {
  return (dispatch) => {
    
    dispatch({ 
      type: FETCH_GAIA_LINKS_START,
      payload: gaiaLinks
     })
    const fetchGaiaLinkFileQueue = []
    fetchGaiaLinkFileQueue.push(new Promise((resolve) => {
      blockstackGetFile('gaiaLinks.json')
      .then((fileContents) => {
        dispatch({
          type: FETCH_SAVED_GAIA_LINKS_SUCCESS,
          payload: JSON.parse(fileContents)
        })
        resolve(JSON.parse(fileContents))
      })
      .catch((error) =>{
        dispatch({
          type: FETCH_SAVED_GAIA_LINKS_ERROR,
          payload: error
        })
        resolve(gaiaLinks)
      })
    }))
    return Promise.all(fetchGaiaLinkFileQueue)
    .then((fetchedGaiaLinks) => {
      const flattenedGaiaLinks = fetchedGaiaLinks.reduce((a, b) => !a ? b : [].concat(a).concat(b))
      let dedup = {}
      const uniqueGaiaLinks = []
      if ((flattenedGaiaLinks || []).length < 1) {
        return
      } else {
        flattenedGaiaLinks.filter((gaiaLink) => {
          if (dedup[gaiaLink.id] === undefined) {
            dedup[gaiaLink.id] = {}
            uniqueGaiaLinks.push(gaiaLink)
            return true
          }
          return false
        })      
      }
      return uniqueGaiaLinks
    }).catch((error) => {
      dispatch({
        type: FETCH_GAIA_LINKS_ERROR,
        payload: error
      })
      return
    })
  }
}