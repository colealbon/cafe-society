export const FILTER_FIELD_SELECT_FIELD = 'FILTER_FIELD_SELECT_FIELD'

export const selectFilterField = filterField => {
  return (dispatch) => {
    dispatch({
      type: FILTER_FIELD_SELECT_FIELD,
      payload: filterField
    })
  }
}
