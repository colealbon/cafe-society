import React from 'react'
import SectionContent from './articles/SectionContent'
import { userLogout } from '../actions/blockstackUserActions'
import { connect } from 'react-redux'


const mapStateToProps = ({blockstackUser}) => {
  return {
      blockstackUser: blockstackUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogout: (() => {
      dispatch(userLogout())
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
