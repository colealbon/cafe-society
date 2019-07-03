import {
    SECTION_UPDATE_SECTION
  } from '../actions/sectionActions'
  
  const initialState = {name: ''}
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case SECTION_UPDATE_SECTION:
        return { ...state, ...action.payload }
      default:
        return state
    }
  }
  