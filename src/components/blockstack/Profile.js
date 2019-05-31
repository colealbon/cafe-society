import React, {Fragment} from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({blockstackUser}) => {
  return {
      blockstackUser
  }
}

export const Profile = () => {
  return (
    <Fragment>
    profile
    </Fragment>
  )
}


export default connect(mapStateToProps)(Profile)
