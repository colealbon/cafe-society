import {
  CONTACTS_ADD_CONTACT,
  CONTACTS_REMOVE_CONTACT,
  CONTACTS_TOGGLE_CONTACT,
  FETCH_SAVED_CONTACTS_SUCCESS,
  FETCH_CONTACTS_SUCCESS
} from '../actions/contactActions'

const initialState = [
  {id: 'astrologer.id', name: 'astrologer.id', muted: false}
]

export default (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_APP':
      return initialState
        
    case CONTACTS_ADD_CONTACT:
      return [
        ...state.filter(contact => contact.id !== action.payload.id),
        action.payload
      ]
    case CONTACTS_REMOVE_CONTACT:
      return state.filter(stateItem => {
        let payload = Array.isArray(action.payload) ? action.payload : [action.payload]
        return payload.filter((payloadItem) => (payloadItem.id === stateItem.id)).length === 0
      })

    case CONTACTS_TOGGLE_CONTACT:
      return state.map(contact => contact.id === action.payload.id ? { ...contact, muted: !contact.muted || false } : contact)

    case FETCH_SAVED_CONTACTS_SUCCESS:
      return state.map((stateItem) => {
        const overwrite = action.payload.filter((payloadItem) => payloadItem.id === stateItem.id).filter(payloadItem => !!payloadItem.title)[0]
        return (!!overwrite) ? overwrite : stateItem
      }).concat(action.payload.filter((payloadItem) => {
        let itemExists = false
        state.map((stateItem) => {
          if (stateItem.id === payloadItem.id) {
            itemExists = true
          }
          return 'o'
        })
        return !itemExists
      }))

    case FETCH_CONTACTS_SUCCESS:
      return state.filter((stateItem) => !Array.isArray(stateItem))
      .concat(action.payload.filter((payloadItem) => {
        let itemExists = false
        state.map((stateItem) => {
          if (stateItem.id === payloadItem.id) {
            itemExists = true
          }
          return 'o'
        })
        return !itemExists
      }))
    default:
      return state
  }
}
  