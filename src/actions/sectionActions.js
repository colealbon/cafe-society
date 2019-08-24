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
      if (!JSON.parse(savedSections) && JSON.parse(savedSections) === {}) {
        return 'o'
      }
      dispatch({
        type: FETCH_SAVED_SECTIONS_SUCCESS,
        payload: JSON.parse(savedSections)
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

export const PUBLISH_SECTIONS_START = 'PUBLISH_SECTIONS_START'
export const PUBLISH_SECTIONS_SUCCESS = 'PUBLISH_SECTIONS_SUCCESS'
export const PUBLISH_SECTIONS_ERROR = 'PUBLISH_SECTIONS_ERROR'

export const publishSections = (sections) => {
  if (!!sections) {
    return (dispatch) => {
      dispatch({
        type: PUBLISH_SECTIONS_START,
        payload: sections
      })
      const fileContent = JSON.stringify(sections)
      return blockstack.putFile('sections.json', fileContent)
      .then((response) => {
        dispatch({
          type: PUBLISH_SECTIONS_SUCCESS,
          payload: {
            response: response,
            sections: sections
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: PUBLISH_SECTIONS_ERROR,
          payload: {
            error: error
          }
        })
      })
    }
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

export const addSection = (section, sections) => {
  return (dispatch) => {
    dispatch({
      type: SECTIONS_ADD_SECTION,
      payload: {
        id: section.toLowerCase().replace(' ', '-'),
        name: section
      }
    })
    dispatch(updateSection(''))
    dispatch(publishSections(sections.filter((sectionItem) => sectionItem.id !== section.toLowerCase().replace(' ', '-')).concat({ id: section.toLowerCase().replace(' ', '-'), name: section,  muted: false })))
  }
}

export const SECTIONS_REMOVE_SECTION = 'SECTIONS_REMOVE_SECTION'

export const removeSection = (section, sections) => {
  return (dispatch) => {
    dispatch({
      type: SECTIONS_REMOVE_SECTION,
      payload: section
    })
    dispatch(publishSections(sections.filter((filterSection) => filterSection.id !== section.id)))
  }
}

export const SECTIONS_TOGGLE_SECTION = 'SECTIONS_TOGGLE_SECTION'

export const toggleSection = (section, sections) => {
  return (dispatch) => {
    dispatch({
      type: SECTIONS_TOGGLE_SECTION,
      payload: section
    })
    dispatch(
      publishSections(
        sections.map(sectionItem => {
          return sectionItem.id === section.id ?
          { ...sectionItem, muted: !sectionItem.muted || false } : 
          sectionItem
        })
      )
    )
  }
}
