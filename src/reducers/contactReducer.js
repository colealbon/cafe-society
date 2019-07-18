import { CONTACT_UPDATE_CONTACT } from '../actions/contactActions'
  
  export default (state = '', action) => {
    switch (action.type) {
      case 'RESET_APP':
        return ''
      case CONTACT_UPDATE_CONTACT:
        return action.payload
      default:
        return state
    }
  }
  