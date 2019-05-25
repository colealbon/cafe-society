export const FEED_SELECT_FEED = 'FEED_SELECT_FEED'

export const selectFeed = feed => {
  return (dispatch) => {
    dispatch({
      type: FEED_SELECT_FEED,
      payload: feed
    })
  }
}

export const FEED_UPDATE_FEED = 'FEED_UPDATE_FEED'

export const updateFeed = text => {
  return (dispatch) => {
    dispatch({
      type: FEED_UPDATE_FEED,
      payload: {url: text}
    })
  }
}

export const FEEDS_ADD_FEED = 'FEEDS_ADD_FEED'

export const addFeed = url => {
  return (dispatch) => {
    dispatch({
      type: FEEDS_ADD_FEED,
      payload: {
        id: url.toLowerCase().replace(' ', '-'),
        url: url
      }
    })
    updateFeed({url: ''})
  }
}

export const FEEDS_REMOVE_FEED = 'FEEDS_REMOVE_FEED'

export const removeFeed = feed => {
  return (dispatch) => {
    dispatch({
      type: FEEDS_REMOVE_FEED,
      payload: feed
    })
  }
}

export const FEEDS_TOGGLE_FEED = 'FEEDS_TOGGLE_FEED'

export const toggleFeed = feed => {
  return (dispatch) => {
    dispatch({
      type: FEEDS_TOGGLE_FEED,
      payload: feed
    })
  }
}
