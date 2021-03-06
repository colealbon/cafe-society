import {
    SECTIONS_ADD_SECTION,
    SECTIONS_REMOVE_SECTION,
    SECTIONS_TOGGLE_SECTION,
    FETCH_SAVED_SECTIONS_SUCCESS
  } from '../actions/sectionActions'
export default (state = initialState, action) => {
  switch (action.type) {

    case 'RESET_APP':
      return initialState

    case SECTIONS_ADD_SECTION:
      return [
        ...state.filter(section => section.id !== action.payload.id),
        action.payload
      ].filter(sectionItem => !!sectionItem.id)

    case FETCH_SAVED_SECTIONS_SUCCESS:
      return (Array.isArray(action.payload) && action.payload.length > 0) ? action.payload.filter(sectionItem => !!sectionItem.id) : state.filter(sectionItem => !!sectionItem.id)

    case SECTIONS_REMOVE_SECTION:
      return state.filter(stateItem => {
        let payload = Array.isArray(action.payload) ? action.payload : [action.payload]
        return payload.filter((payloadItem) => (payloadItem.id === stateItem.id)).length === 0
      }).filter(sectionItem => !!sectionItem.id)

    case SECTIONS_TOGGLE_SECTION:
      return state.map(section => section.id === action.payload.id ? { ...section, muted: !section.muted || false } : section).filter(sectionItem => !!sectionItem.id)

    default:
      return state.filter(sectionItem => !!sectionItem.id)
  }
}

const initialState = [
  {
  id: 'world',
  name: 'world'
  },
  {
  id: 'business',
  name: 'business'
  },
  {
  id: 'technology',
  name: 'technology'
  },
  {
  id: 'variety',
  name: 'variety'
  },
  {
  id: 'recruiting',
  name: 'recruiting'
  }
]
  