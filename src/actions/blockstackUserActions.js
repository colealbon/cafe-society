import * as blockstack from 'blockstack'
var memoize = require("memoizee");

export const FETCH_USER_DATA = 'FETCH_USER_DATA'
export const USER_LOGIN = 'USER_LOGIN'
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
export const USER_LOGOUT = 'USER_LOGOUT'
export const USER_HANDLE_LOGIN = 'USER_HANDLE_LOGIN'
export const USER_LOGGED_IN = 'USER_LOGGED_IN'
export const USER_LOGIN_ERROR = 'USER_LOGIN_ERROR'

// The static isUserSignedIn() function will be deprecated in the next major
// release of blockstack.js. Create an instance of UserSession and call the
// instance method isUserSignedIn().

const slowBlockstackLoadUserData = () => blockstack.loadUserData()
const blockstackLoadUserData = memoize(slowBlockstackLoadUserData, { maxAge: 10000 })

export const fetchUserData = () => {
  const type = FETCH_USER_DATA
  if (blockstack.isUserSignedIn()) {
    return {
      type,
      payload: {
        isAuthenticated: true,
        profile: blockstackLoadUserData()
      }
    }
  } else if (blockstack.isSignInPending()) {
    return {
      type,
      payload: {
        isLoginPending: true
      }
    }
  }
  return { type }
}

export const loginWithBlockstack = () => {
  // Open the blockstack browser for sign in
  // After choosing an Id to sign in with, redirect back to the login page
  alert('loginWithBlockstack')
  blockstack.redirectToSignIn(
    `${window.location.origin}/handle-login`,
    `${window.location.origin}/manifest.json`,
     ['store_write', 'publish_data'])
  return { type: USER_LOGIN }
}

export const userLogout = () => {
  blockstack.signUserOut()
  window.location.replace(`${window.location.origin}/`)
  return { type: USER_LOGOUT }
}

export const userLoginError = (error) => {
  return { type: USER_LOGIN_ERROR, payload: error }
}

export const handleBlockstackLogin = () => {
  alert('handleBlockstackLogin')
  return (dispatch) => {
    dispatch({ type: USER_HANDLE_LOGIN })

    // Handle sign in from Blockstack after redirect from Blockstack browser
    // Once sign in completes (promise is fulfilled), redirect to an authenticated only route

    return blockstack.handlePendingSignIn()
    .then( () => {
        window.location.replace(`${window.location.origin}/`)
        dispatch({ type: USER_LOGIN_SUCCESS })
        dispatch(fetchUserData())
      },

      error => dispatch(userLoginError(error))
    )
  }
}

// import { AppConfig } from 'blockstack'
//
// export const appConfig = new AppConfig(['store_write', 'publish_data'])
