import {
  FILTER_SELECT_FILTER
} from '../actions/filterActions'

import { LOCATION_CHANGE } from 'connected-react-router'

export default (state = {}, action) => {
  switch (action.type) {
    case FILTER_SELECT_FILTER:
      return action.payload
    case LOCATION_CHANGE:
        return {}
    default:
      return state
  }
}
