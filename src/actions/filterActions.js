import * as blockstack from 'blockstack'
var memoize = require("memoizee");

export const FILTER_UPDATE_FILTER = 'FILTER_UPDATE_FILTER'

export const updateFilter = text => {
  return (dispatch) => {
    dispatch({
      type: FILTER_UPDATE_FILTER,
      payload: {text: text}
    })
  }
}

export const FILTERS_UPDATE_FILTERS = 'FILTERS_UPDATE_FILTERS'

export const updateFilters = filters => {
  return (dispatch) => {
    dispatch({
      type: FILTERS_UPDATE_FILTERS,
      payload: filters
    })
  }
}

export const FILTERS_ADD_FILTER = 'FILTERS_ADD_FILTER'

export const addFilter = (filter, filters) => {
  return (dispatch) => {
    dispatch({
      type: FILTERS_ADD_FILTER,
      payload: filter
    })
    dispatch(updateFilter({text: ''}))
    dispatch(publishFilters([
      ...filters.filter(filterItem => filterItem.id !== filter.id),
      filter
    ]))
  }
}

export const FILTERS_REMOVE_FILTER = 'FILTERS_REMOVE_FILTER'

export const removeFilter = (filter, filters) => {
  return (dispatch) => {
    dispatch({
      type: FILTERS_REMOVE_FILTER,
      payload: filter
    })
    dispatch(publishFilters(filters.filter((filterItem) => filterItem.id !== filter.id)))
  }
}
export const PUBLISH_FILTERS_REQUEST = 'PUBLISH_FILTERS_REQUEST'
export const PUBLISH_FILTERS_SUCCESS = 'PUBLISH_FILTERS_SUCCESS'
export const PUBLISH_FILTERS_ERROR = 'PUBLISH_FILTERS_ERROR'

export const publishFilters = (filters) => {
  return (dispatch) => {
    dispatch({
      type: PUBLISH_FILTERS_REQUEST,
      payload: filters
    })
    const fileContent = JSON.stringify(filters)
    return blockstack.putFile('filters.json', fileContent, {encrypt: false})
      .then((response) => {
        dispatch({
          type: PUBLISH_FILTERS_SUCCESS,
          payload: {
            response: response,
            filters: filters
          }
        })
      }
    )
  }
}

export const FILTERS_TOGGLE_FILTER = 'FILTERS_TOGGLE_FILTER'

export const toggleFilter = (filter, filters) => {
  return (dispatch) => {
    dispatch({
      type: FILTERS_TOGGLE_FILTER,
      payload: filter
    })
    dispatch(publishFilters(filters.filter((mapFilter) => mapFilter.id !== filter.id).concat({ ...filter, muted: !filter.muted || false })))
  }
}

export const FETCH_FILTERS_REQUEST = 'FETCH_FILTERS_REQUEST'
export const FETCH_FILTERS_SUCCESS = 'FETCH_FILTERS_SUCCESS'
export const FETCH_FILTERS_ERROR = 'FETCH_FILTERS_ERROR'

const slowBlockstackGetFile = (filename, options) => blockstack.getFile(filename, options)
const blockstackGetFile = memoize(slowBlockstackGetFile, { maxAge: 10000 })

export const fetchBlockstackFilters = (contacts) => {
  return (dispatch) => {
    dispatch({ type: FETCH_FILTERS_REQUEST })
    dispatch(() => {
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
          if ((flattenedFilters || []).length < 1) {
          dispatch({
            type: FETCH_FILTERS_SUCCESS,
            payload: [{
              id: 'measles',
              text: 'measles',
              fields: [{id:'title', name:'title', muted: false}],
              sections: [{id:'politics', name:'politics'}]
            }]
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
          dispatch(publishFilters(uniqueFilters))
        }
      })
    })
  }
}
