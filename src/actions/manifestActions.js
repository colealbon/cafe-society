import * as blockstack from 'blockstack'
var memoize = require("memoizee")

const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { promise: true, maxAge: 10000 })


export const FETCH_SAVED_MANIFEST_SUCCESS = 'FETCH_SAVED_MANIFEST_SUCCESS'

export const FETCH_SAVED_MANIFESTS_ERROR = 'FETCH_SAVED_MANIFESTS_ERROR'
export const FETCH_SAVED_MANIFESTS_START = 'FETCH_SAVED_MANIFESTS_START'
export const FETCH_SAVED_MANIFESTS_SUCCESS = 'FETCH_SAVED_MANIFESTS_SUCCESS'

export const DELETE_MANIFEST_START = 'DELETE_MANIFEST_START'
export const DELETE_MANIFEST_SUCCESS = 'DELETE_MANIFEST_SUCCESS'
export const DELETE_MANIFEST_ERROR = 'DELETE_MANIFEST_ERROR'

export const MANIFESTS_REMOVE_MANIFEST = 'MANIFESTS_REMOVE_MANIFEST'

export const PUBLISH_MANIFESTS_START = 'PUBLISH_MANIFESTS_START'
export const PUBLISH_MANIFESTS_SUCCESS = 'PUBLISH_MANIFESTS_SUCCESS'
export const PUBLISH_MANIFESTS_ERROR = 'PUBLISH_MANIFESTS_ERROR'

export const publishManifests = (manifests) => {
  return (dispatch) => {
    dispatch({
      type: PUBLISH_MANIFESTS_START,
      payload: manifests.filter(manifestItem => manifestItem.muted === true)
    })
    dispatch(() => {
      const fileContent = JSON.stringify(manifests.filter(manifestItem => manifestItem.muted === true))
      blockstack.putFile('manifests.json', fileContent)
      .then((response) => {
        dispatch({
          type: PUBLISH_MANIFESTS_SUCCESS,
          payload: {
            response: response,
            manifests: manifests.filter(manifestItem => manifestItem.muted === true)
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: PUBLISH_MANIFESTS_ERROR,
          payload: {
            error: error
          }
        })
      })
    })
  }
}

export const fetchBlockstackManifests = () => {
  return (dispatch) => {
    blockstackGetFile('manifests.json')
    .then((savedManifests) => {
      if (JSON.parse(savedManifests === null)) {
        return
      }
      dispatch({
        type: FETCH_SAVED_MANIFESTS_SUCCESS,
        payload: JSON.parse(savedManifests)
      })
    })
    .catch((error) => {
      dispatch({
        type: FETCH_SAVED_MANIFESTS_ERROR,
        payload: error
      })
    })
  }
}

export const removeManifest = (removeManifest, manifests) => {
  const removeManifests = [].concat(removeManifest)
  return (dispatch) => {
    dispatch({
      type: MANIFESTS_REMOVE_MANIFEST,
      payload: removeManifest
    })
    if (!!manifests) {
      dispatch(publishManifests(manifests.filter(manifestItem => {
        return removeManifests.filter((removeManifestItem) => (removeManifestItem.link === manifestItem.link)).length === 0
      })))
    }
  }
}