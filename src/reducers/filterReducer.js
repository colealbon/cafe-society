
import {
  FILTER_UPDATE_FILTER,
} from '../actions/filterActions'

const initialState = {text: ''}

export default (state = initialState, action) => {
  switch (action.type) {
    case FILTER_UPDATE_FILTER:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
