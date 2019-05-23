export const LEFT_DRAWER_OPEN = 'LEFT_DRAWER_OPEN'
export const LEFT_DRAWER_CLOSE = 'LEFT_DRAWER_CLOSE'

export const handleLeftDrawerOpen = () => {
  return (dispatch) => {
    dispatch({
      type: LEFT_DRAWER_OPEN
    })
  }
};

export const handleLeftDrawerClose = () => {
  return (dispatch) => {
    dispatch({
      type: LEFT_DRAWER_CLOSE
    })
  }
};
