import React from 'react'
import Landing from '../Landing'
import { userLogout } from '../../actions/blockstackUserActions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const mapStateToProps = ({blockstackUser}) => {
  return {
      blockstackUser: blockstackUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLogout: () => {
      dispatch(userLogout())
    }
  }
}

const Logout = ({blockstackUser, handleLogout}) => {
  if (blockstackUser.isAuthenticated) {
    handleLogout()
  }
  return (
      <Landing></Landing>
  )
}

Logout.propTypes = {
  blockstackUser: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)
