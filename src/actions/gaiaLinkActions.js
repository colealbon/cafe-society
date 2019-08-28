import * as blockstack from 'blockstack'

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

export const removeGaiaLink = (gaiaLink) => {
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