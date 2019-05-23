import {
    SECTION_SELECT_SECTION
} from '../actions/sectionActions'

export default (state = {}, action) => {

  switch (action.type) {
    case SECTION_SELECT_SECTION:
      return action.payload
    default:
      return state
  }
}
