import {
  FILTER_SECTION_SELECT_SECTION
} from '../actions/filterSectionActions'

export default (state = {}, action) => {
  switch (action.type) {
    case FILTER_SECTION_SELECT_SECTION:
      return action.payload
    default:
      return state
  }
}
