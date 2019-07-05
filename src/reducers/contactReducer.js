import { CONTACT_UPDATE_CONTACT } from '../actions/contactActions'
  
  export default (state = '', action) => {
    switch (action.type) {
      case CONTACT_UPDATE_CONTACT:
        return action.payload
      default:
        return state
    }
  }
  