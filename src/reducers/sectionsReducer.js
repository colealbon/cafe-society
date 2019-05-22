import {
    SECTIONS_ADD_SECTION,
    SECTIONS_REMOVE_SECTION,
    SECTIONS_TOGGLE_SECTION,
    FETCH_SECTIONS_SUCCESS
} from '../actions/sectionActions'


const initialState = [
    {id:'Technology', name: 'Technology', muted:false},
    {id:'Design', name: 'Design', muted:false},
    {id:'Culture', name: 'Culture', muted:false},
    {id:'Business', name: 'Business', muted:false},
    {id:'Politics', name: 'Politics', muted:false},
    {id:'Opinion', name: 'Opinion',  muted:false},
    {id:'Science', name: 'Science', muted:false},
    {id:'Health', name: 'Health', muted:false},
    {id:'Style', name: 'Style', muted:false},
    {id:'Travel', name: 'Travel', muted:false}
  ]

  export default (state = initialState, action) => {
    switch (action.type) {
      case SECTIONS_ADD_SECTION:
        return [
          ...state,
          {
            id: action.payload.id,
            url: action.payload.url
          }
        ]
      case SECTIONS_REMOVE_SECTION:
        return state
        .filter(section => section.id !== action.payload.id);

      case SECTIONS_TOGGLE_SECTION:
        return state.map(section => section.id === action.payload.id ? { ...section, muted: !section.muted || false } : section )

      case FETCH_SECTIONS_SUCCESS:
          return action.payload

      default:
          return state
    }
  }
