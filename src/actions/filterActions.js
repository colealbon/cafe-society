import * as blockstack from 'blockstack'
var memoize = require("memoizee");

export const FILTER_SELECT_FILTER = 'FILTER_SELECT_FILTER'

export const selectFilter = filter => {
  return (dispatch) => {
    dispatch({
      type: FILTER_SELECT_FILTER,
      payload: filter
    })
  }
}

export const FILTER_UPDATE_FILTER = 'FILTER_UPDATE_FILTER'

export const updateFilter = text => {
  return (dispatch) => {
    dispatch({
      type: FILTER_UPDATE_FILTER,
      payload: {text: text}
    })
  }
}

export const FILTERS_ADD_FILTER = 'FILTERS_ADD_FILTER'

export const addFilter = filter => {
  return (dispatch) => {
    dispatch({
      type: FILTERS_ADD_FILTER,
      payload: filter
    })
    updateFilter({text: ''})
  }
}

export const FILTERS_REMOVE_FILTER = 'FILTERS_REMOVE_FILTER'

export const removeFilter = filter => {
  return (dispatch) => {
    dispatch({
      type: FILTERS_REMOVE_FILTER,
      payload: filter
    })
  }
}

export const FILTERS_TOGGLE_FILTER = 'FILTERS_TOGGLE_FILTER'

export const toggleFilter = filter => {
  return (dispatch) => {
    dispatch({
      type: FILTERS_TOGGLE_FILTER,
      payload: filter
    })
  }
}

export const PUBLISH_FILTERS_REQUEST = 'PUBLISH_FILTERS_REQUEST'
export const PUBLISH_FILTERS_SUCCESS = 'PUBLISH_FILTERS_SUCCESS'
export const PUBLISH_FILTERS_ERROR = 'PUBLISH_FILTERS_ERROR'
export const FETCH_FILTERS_REQUEST = 'FETCH_FILTERS_REQUEST'
export const FETCH_FILTERS_SUCCESS = 'FETCH_FILTERS_SUCCESS'
export const FETCH_FILTERS_ERROR = 'FETCH_FILTERS_ERROR'

const slowBlockstackGetFile = (filename, options) => blockstack.getFile(filename, options)
const blockstackGetFile = memoize(slowBlockstackGetFile, { maxAge: 10000 })

export const fetchBlockstackFilters = (contacts) => {
  return (dispatch) => {
    dispatch({ type: FETCH_FILTERS_REQUEST })
    const fetchFilterFileQueue = []
    fetchFilterFileQueue.push(new Promise((resolve, reject) => {
      blockstackGetFile('filters.json', {
        decrypt: false
      })
      .then((fileContents) => resolve((JSON.parse(fileContents))))
      .catch((error) => reject(error))
    }))
    if (contacts.length > 0) {
      contacts.filter((contact) => !contact.muted).map((contact) => {
        return fetchFilterFileQueue.push(new Promise((resolve) => {
            blockstackGetFile('filters.json', {
              decrypt: false,
              username: contact.name
            })
            .then((fileContents) => {
              if (fileContents === null) {
                resolve([])
              } else {
                resolve(
                  JSON.parse(fileContents)
                  .map((filter) => {
                    filter.muted = false
                    return(filter)
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

    Promise.all(fetchFilterFileQueue)
    .then((fetchedFilters) => {
      const flattenedFilters = fetchedFilters.reduce((a, b) => !a ? b : a.concat(b))
      const uniqueFilters = []
      let dedup = {}
      if (flattenedFilters === null) {
        dispatch({
          type: FETCH_FILTERS_SUCCESS,
          payload: []
        })
      } else {
        flattenedFilters.filter((filter) => {
          if (dedup[filter.id] === undefined) {
            dedup[filter.id] = {}
            uniqueFilters.push(filter)
            return true
          }
          return false
        })
        dispatch({
          type: FETCH_FILTERS_SUCCESS,
          payload: uniqueFilters
        })
      }
    })
  }
}

export const publishFilters = (filters) => {
  const timestampedFilters = filters.map((filter) => {
    let timestampedFilter = Object.assign(filter)
  //   if (timestampedFilter.fields.indexOf('title') !== -1) {
  //     articles.map((article) => {
  //       if (article.title.indexOf(timestampedFilter.text) !== -1) {
  //         timestampedFilter.lastUsed = new Date().getTime()
  //       }
  //       return 'o'
  //     })
  //   }
  //   if (timestampedFilter.fields.indexOf('link') !== -1) {
  //     articles.map((article) => {
  //       if (article.link.indexOf(timestampedFilter.text) !== -1) {
  //         timestampedFilter.lastUsed = new Date().getTime()
  //       }
  //       return 'o'
  //     })
  //   }
  //   if (timestampedFilter.fields.indexOf('contentSnippet') !== -1) {
  //     articles.map((article) => {
  //       if (article.contentSnippet.indexOf(timestampedFilter.text) !== -1) {
  //         timestampedFilter.lastUsed = new Date().getTime()
  //       }
  //       return 'o'
  //     })
  //   }
    return timestampedFilter
  })
  return (dispatch) => {
    dispatch({
      type: PUBLISH_FILTERS_REQUEST,
      payload: timestampedFilters
    })
    const fileContent = JSON.stringify(filters)
    return blockstack.putFile('filters.json', fileContent, {encrypt: false})
      .then(() => {
        dispatch({
          type: PUBLISH_FILTERS_SUCCESS
        })
      }
    )
  }
}
