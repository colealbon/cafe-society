import {
    SECTION_SELECT_SECTION
} from '../actions/sectionActions'

import { LOCATION_CHANGE } from 'connected-react-router';

export default (state = {}, action) => {

  switch (action.type) {
    case SECTION_SELECT_SECTION:
      return action.payload
    case LOCATION_CHANGE:
      return {"id": action.payload.location.pathname.replace('/', '')}
    default:
      return state
  }
}
