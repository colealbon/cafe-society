import {
  FETCH_ACCOUNTS_SUCCESS
} from '../actions/contractActions'

const initialState = {
  text: 'welcome!'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNTS_SUCCESS:
      return ([].concat(action.payload).length === 0) ? {text: 'please log into your web3 account (metamask)'} : {text: ''}
    default:
      return state
  }
}
