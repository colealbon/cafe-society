export const FEED_SECTION_SELECT_SECTION = 'FEED_SECTION_SELECT_SECTION'

export const selectFeedSection = feedSection => {
  return (dispatch) => {
    dispatch({
      type: FEED_SECTION_SELECT_SECTION,
      payload: feedSection
    })
  }
}
