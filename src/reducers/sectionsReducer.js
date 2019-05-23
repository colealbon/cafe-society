import {
    SECTIONS_ADD_SECTION,
    SECTIONS_REMOVE_SECTION,
    SECTIONS_TOGGLE_SECTION
} from '../actions/sectionActions'


const initialState = [
    {id:'Technology', name: 'Technology', muted:false},
    {id:'Culture', name: 'Culture', muted:false},
    {id:'Opinion', name: 'Opinion',  muted:false},
    {id:'Travel', name: 'Travel', muted:false}
  ]

  export default (state = initialState, action) => {
    switch (action.type) {
      case SECTIONS_ADD_SECTION:
        return [
          ...state,
          {
            id: action.payload.id,
            name: action.payload.name
          }
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
