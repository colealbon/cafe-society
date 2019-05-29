export const FILTER_SECTION_SELECT_SECTION = 'FILTER_SECTION_SELECT_SECTION'

export const selectFilterSection = filterSection => {
  return (dispatch) => {
    dispatch({
      type: FILTER_SECTION_SELECT_SECTION,
      payload: filterSection
    })
  }
}
