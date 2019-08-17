import * as blockstack from 'blockstack'
var memoize = require('memoizee')

const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { promise: true, maxAge: 10000 })

export const FETCH_SAVED_SECTIONS_START = 'FETCH_SAVED_SECTIONS_START'
export const FETCH_SAVED_SECTIONS_SUCCESS = 'FETCH_SAVED_SECTIONS_SUCCESS'
export const FETCH_SAVED_SECTIONS_FAIL = 'FETCH_SAVED_SECTIONS_FAIL'

export const fetchBlockstackSections = (sections) => {
  return (dispatch) => {
    blockstackGetFile('sections.json')
    .then((savedSections) => {
      if (!JSON.parse(savedSections)) {
        return
      }
      dispatch({
        type: FETCH_SAVED_SECTIONS_SUCCESS,
        payload: savedSections
      })
    })
    .catch((error) => {
      dispatch({
        type: FETCH_SAVED_SECTIONS_SUCCESS,
        payload: error
      })
    })
  }
}

export const SECTION_SELECT_SECTION = 'SECTION_SELECT_SECTION'

export const selectSection = section => {
  return (dispatch) => {
    dispatch({
      type: SECTION_SELECT_SECTION,
      payload: section
    })
  }
}

export const SECTION_UPDATE_SECTION = 'SECTION_UPDATE_SECTION'

export const updateSection = text => {
  return (dispatch) => {
    dispatch({
      type: SECTION_UPDATE_SECTION,
      payload: {name: text}
    })
  }
}

export const SECTIONS_ADD_SECTION = 'SECTIONS_ADD_SECTION'

export const addSection = name => {
  return (dispatch) => {
    dispatch({
      type: SECTIONS_ADD_SECTION,
      payload: {
        id: name.toLowerCase().replace(' ', '-'),
        name: name
      }
    })
    updateSection({name: ''})
  }
}

export const SECTIONS_REMOVE_SECTION = 'SECTIONS_REMOVE_SECTION'

export const removeSection = section => {
  return (dispatch) => {
    dispatch({
      type: SECTIONS_REMOVE_SECTION,
      payload: section
    })
  }
}

export const SECTIONS_TOGGLE_SECTION = 'SECTIONS_TOGGLE_SECTION'

export const toggleSection = section => {
  return (dispatch) => {
    dispatch({
      type: SECTIONS_TOGGLE_SECTION,
      payload: section
    })
  }
}
