import * as blockstack from 'blockstack'

var memoize = require("memoizee");

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

export const PUBLISH_SECTIONS_REQUEST = 'PUBLISH_SECTIONS_REQUEST'
export const PUBLISH_SECTIONS_SUCCESS = 'PUBLISH_SECTIONS_SUCCESS'
export const PUBLISH_SECTIONS_ERROR = 'PUBLISH_SECTIONS_ERROR'
export const FETCH_SECTIONS_REQUEST = 'FETCH_SECTIONS_REQUEST'
export const FETCH_SECTIONS_SUCCESS = 'FETCH_SECTIONS_SUCCESS'
export const FETCH_SECTIONS_ERROR = 'FETCH_SECTIONS_ERROR'

const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { maxAge: 10000 })

export const fetchBlockstackSections = (contacts) => {
  return (dispatch) => {
    dispatch({ type: FETCH_SECTIONS_REQUEST })
    const fetchSectionFileQueue = []
    fetchSectionFileQueue.push(new Promise((resolve, reject) => {
      blockstackGetFile('sections.json', {
        decrypt: false
      })
      .then((fileContents) => resolve((JSON.parse(fileContents))))
      .catch((error) => reject(error))
    }))
    if (!!contacts && contacts.length > 0) {
      contacts.filter((contact) => !contact.muted).map((contact) => {
        return fetchSectionFileQueue.push(new Promise((resolve) => {
            blockstackGetFile('sections.json', {
              decrypt: false,
              username: contact.name
            })
            .then((fileContents) => {
              if (fileContents === null) {
                resolve([])
              } else {
                resolve(
                  JSON.parse(fileContents)
                  .map((section) => {
                    section.muted = false
                    return(section)
                  })
                )
              }
            })
            .catch(() => {
              resolve([])
            })
        }))
      })
    }

    Promise.all(fetchSectionFileQueue)
    .then((fetchedSections) => {
      const flattenedSections = fetchedSections.reduce((a, b) => !a ? b : a.concat(b))
      const uniqueSections = []
      let dedup = {}

      if ((flattenedSections || []).length < 1) {
        dispatch({
          type: FETCH_SECTIONS_SUCCESS,
          payload: [
            {
              id:'politics',
              name: 'politics',
              muted: false
            },
            {
              id:'horoscope',
              name: 'horoscope',
              muted: false
            }
          ]
        })
      } else {
        flattenedSections.filter((section) => {
          if (dedup[section.id] === undefined) {
            dedup[section.id] = {}
            uniqueSections.push(section)
            return true
          }
          return false
        })
        dispatch({
          type: FETCH_SECTIONS_SUCCESS,
          payload: uniqueSections
        })
      }
    })
  }
}

export const publishSections = (sections) => {
  return (dispatch) => {
    dispatch({
      type: PUBLISH_SECTIONS_REQUEST,
      payload: sections
    })
    const fileContent = JSON.stringify(sections)
    return blockstack.putFile('sections.json', fileContent, {encrypt: false})
      .then(() => {
        dispatch({
          type: PUBLISH_SECTIONS_SUCCESS
        })
      }
    )
  }
}
