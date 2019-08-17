import * as blockstack from 'blockstack'
//import { fetchFeeds } from './feedActions'
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
    dispatch(updateFilter(''))
    dispatch(publishFilters(filters.filter(filterItem => filterItem.id !== filter.id).concat(filter)))
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
export const PUBLISH_FILTERS_START = 'PUBLISH_FILTERS_START'
export const PUBLISH_FILTERS_FAIL = 'PUBLISH_FILTERS_FAIL'
export const PUBLISH_FILTERS_SUCCESS = 'PUBLISH_FILTERS_SUCCESS'
export const PUBLISH_FILTERS_ERROR = 'PUBLISH_FILTERS_ERROR'

export const publishFilters = (filters) => {
  return (dispatch) => {
    dispatch({
      type: PUBLISH_FILTERS_START,
      payload: filters
    })
    const fileContent = JSON.stringify(filters)
    return blockstack.putFile('filters.json', fileContent)
      .then((response) => {
        dispatch({
          type: PUBLISH_FILTERS_SUCCESS,
          payload: {
            response: response,
            filters: filters
          }
        })
      }).catch((error) => {
        dispatch({
          type: PUBLISH_FILTERS_FAIL,
          payload: error
        })
      })
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

export const FETCH_FILTERS_START = 'FETCH_FILTERS_START'
export const FETCH_FILTERS_SUCCESS = 'FETCH_FILTERS_SUCCESS'
export const FETCH_FILTERS_ERROR = 'FETCH_FILTERS_ERROR'
export const FETCH_SAVED_FILTERS_SUCCESS = 'FETCH_SAVED_FILTERS_SUCCESS'
export const FETCH_SAVED_FILTERS_FAIL = 'FETCH_SAVED_FILTERS_FAIL'

const slowBlockstackGetFile = (filename, options) => blockstack.getFile(filename, options)
const blockstackGetFile = memoize(slowBlockstackGetFile, { maxAge: (1000 * 10) }) //  miliseconds * seconds * minutes

export const fetchBlockstackFilters = (filters) => {
  return (dispatch) => {
    blockstackGetFile('filters.json')
    .then((savedFilters) => {
      if (!JSON.parse(savedFilters)) {
        dispatch({
          type: FETCH_SAVED_FILTERS_SUCCESS,
          payload: [{id: 'placeholder', text:'placeholder'}]
        })
        return
      }
      dispatch({
        type: FETCH_SAVED_FILTERS_SUCCESS,
        payload: savedFilters
      })
    })
  }
}
