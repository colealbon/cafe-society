import {
  SECTION_SELECT_SECTION
} from '../actions/sectionActions'

import { LOCATION_CHANGE } from 'connected-react-router'

export default (state = {}, action) => {
  switch (action.type) {
    case SECTION_SELECT_SECTION:
      return action.payload
    case LOCATION_CHANGE:
      if (action.payload.location.pathname === '/section-list') {
        return state
      }
      if (action.payload.location.pathname === '/contact-list') {
        return state
      }
      if (action.payload.location.pathname === '/feed-list') {
        return state
      }
      if (action.payload.location.pathname === '/filter-list') {
        return state
      }
      if (action.payload.location.pathname === '/web3-account-list') {
        return state
      }
      return {'id': action.payload.location.pathname.replace('/', '')}
    default:
      return state
  }
}
