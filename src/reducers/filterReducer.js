
import {
  FILTER_UPDATE_FILTER,
} from '../actions/filterActions'

export default (state = '', action) => {
  switch (action.type) {
    case 'RESET_APP':
      return ''
    case FILTER_UPDATE_FILTER:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
