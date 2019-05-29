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
