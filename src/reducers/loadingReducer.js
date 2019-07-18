const initialState = true

export default (state = initialState, action) => {
switch (action.type) {
  case 'PLACEHOLDER':
    return { ...state, ...action.payload }
  default:
    return state
}
}
  