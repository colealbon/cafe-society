import {
  CONTACT_UPDATE_CONTACT,
  CONTACTS_TOGGLE_CONTACT
} from '../actions/contactActions'

const initialState = {name: ''}

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTACT_UPDATE_CONTACT:
      return { ...state, ...action.payload }
    case CONTACT_UPDATE_CONTACT:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
