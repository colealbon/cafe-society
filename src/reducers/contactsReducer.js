import {
  CONTACTS_ADD_CONTACT,
  CONTACTS_REMOVE_CONTACT,
  CONTACTS_TOGGLE_CONTACT
} from '../actions/contactActions'

const initialState = [
  {id: 'astrologer.id', name: 'astrologer.id', muted: false}
]

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTACTS_ADD_CONTACT:
      return [
        ...state.filter(contact => contact.id !== action.payload.id),
        action.payload
      ]
    case CONTACTS_REMOVE_CONTACT:
      return state
        .filter(contact => contact.id !== action.payload.id)

    case CONTACTS_TOGGLE_CONTACT:
      return state.map(contact => contact.id === action.payload.id ? { ...contact, muted: !contact.muted || false } : contact)

    default:
      return state
  }
}
