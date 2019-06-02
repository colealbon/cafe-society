import {
  FILTER_FIELD_SELECT_FIELD
} from '../actions/filterFieldActions'

export default (state = {}, action) => {
  switch (action.type) {
    case FILTER_FIELD_SELECT_FIELD:
      return action.payload
    default:
      return state
  }
}
