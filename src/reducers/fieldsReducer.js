const initialState = [
  {id: 'title', name: 'title', muted: false},
  {id: 'link', name: 'link', muted: false},
  {id: 'contentSnippet', name: 'contentSnippet', muted: false}
]

export default (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_APP':
      return initialState
    default:
      return state
  }
}
