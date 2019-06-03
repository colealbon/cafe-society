import {
  SECTIONS_ADD_SECTION,
  SECTIONS_REMOVE_SECTION,
  SECTIONS_TOGGLE_SECTION,
  FETCH_SECTIONS_SUCCESS
} from '../actions/sectionActions'

export default (state = [], action) => {
  switch (action.type) {
    case SECTIONS_ADD_SECTION:
      return [
        ...state.filter(section => section.id !== action.payload.id),
        action.payload
      ]
    case SECTIONS_REMOVE_SECTION:
      return state
        .filter(section => section.id !== action.payload.id)

    case SECTIONS_TOGGLE_SECTION:
      return state.map(section => section.id === action.payload.id ? { ...section, muted: !section.muted || false } : section)

    case FETCH_SECTIONS_SUCCESS:
      return action.payload

    default:
      return state
  }
}
