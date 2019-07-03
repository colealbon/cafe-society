import {
    CONTACT_UPDATE_CONTACT
  } from '../actions/contactActions'
  
  const initialState = {name: ''}
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case CONTACT_UPDATE_CONTACT:
        return { ...state, ...action.payload }
      default:
        return state
    }
  }
  