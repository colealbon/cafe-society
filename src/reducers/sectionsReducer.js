import {
    SECTIONS_ADD_SECTION,
    SECTIONS_REMOVE_SECTION,
    SECTIONS_TOGGLE_SECTION
} from '../actions/sectionActions'


const initialState = [
    {id:'technology', name: 'Technology', muted:false},
    {id:'culture', name: 'Culture', muted:false},
    {id:'horoscope', name: 'Horoscope',  muted:true},
    {id:'travel', name: 'Travel', muted:true}
  ]

  export default (state = initialState, action) => {
    switch (action.type) {
      case SECTIONS_ADD_SECTION:
        return [
          ...state.filter(section => section.id !== action.payload.id),
          action.payload
        ]
      case SECTIONS_REMOVE_SECTION:
        return state
        .filter(section => section.id !== action.payload.id);

      case SECTIONS_TOGGLE_SECTION:
        return state.map(section => section.id === action.payload.id ? { ...section, muted: !section.muted || false } : section )

      default:
          return state
    }
  }
