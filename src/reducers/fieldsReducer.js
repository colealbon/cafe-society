import {
  FIELDS_ADD_FIELD,
  FIELDS_REMOVE_FIELD,
  FIELDS_TOGGLE_FIELD
} from '../actions/sectionActions'

const initialState = [
  {id: 'title', name: 'title', muted: false},
  {id: 'link', name: 'link', muted: false},
  {id: 'contentSnippet', name: 'contentSnippet', muted: false}
]

export default (state = initialState, action) => {
  switch (action.type) {
    case FIELDS_ADD_FIELD:
      return [
        ...state.filter(section => section.id !== action.payload.id),
        action.payload
      ]
    case FIELDS_REMOVE_FIELD:
      return state
        .filter(section => section.id !== action.payload.id)

    case FIELDS_TOGGLE_FIELD:
      return state.map(section => section.id === action.payload.id ? { ...section, muted: !section.muted || false } : section)

    default:
      return state
  }
}
