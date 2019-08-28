import React from 'react'
import SectionContent from './articles/SectionContent'
import { userLogout } from '../actions/blockstackUserActions'
import { connect } from 'react-redux'
// import { push } from 'connected-react-router'

const mapStateToProps = ({blockstackUser}) => {
  return {
      blockstackUser: blockstackUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogout: (() => {
      dispatch({type: USER_LOGOUT})
      dispatch(userLogout('/home'))
      return
    })
  }
}

const Logout = ({blockstackUser, handleLogout}) => {
  if (blockstackUser.isAuthenticated === true) {
    handleLogout()
  }
  return (
    <SectionContent />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)
