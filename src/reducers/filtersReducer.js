import {
  FILTERS_ADD_FILTER,
  FILTERS_REMOVE_FILTER,
  FILTERS_TOGGLE_FILTER
} from '../actions/filterActions'

const initialState = [
  {id: 'Meow Mix', text: 'Meow Mix', muted: true}
]

export default (state = initialState, action) => {
  switch (action.type) {
    case FILTERS_ADD_FILTER:
      return [
        ...state.filter(filter => filter.id !== action.payload.id),
        action.payload
      ]
    case FILTERS_REMOVE_FILTER:
      return state
        .filter(filter => filter.id !== action.payload.id)

    case FILTERS_TOGGLE_FILTER:
      return state.map(filter => filter.id === action.payload.id ? { ...filter, muted: !filter.muted || false } : filter)

    default:
      return state
  }
}
