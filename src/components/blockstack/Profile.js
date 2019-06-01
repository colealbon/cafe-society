import React, {Fragment} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const mapStateToProps = ({blockstackUser}) => {
  return {
      blockstackUser
  }
}

export const Profile = () => {
  return (
    <Fragment>
    JSON.stringify(blockstackUser.profile)
    </Fragment>
  )
}

Profile.propTypes = {
  blockstackUser: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(Profile)
