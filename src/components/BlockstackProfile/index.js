import React, { Fragment } from 'react'
import Typography from '@material-ui/core/Typography'
import VerticalSpace from '../VerticalSpace'
import BlockstackLogin from '../BlockstackLogin'
import BlockstackLogout from '../BlockstackLogout'
import GaiaLinkList from './GaiaLinkList'
import { connect } from 'react-redux'

const mapStateToProps = ({blockstackUser}) => {
  return {
      blockstackUser: !!blockstackUser ? blockstackUser : {}
  }
}

export const BlockstackProfile = ({blockstackUser}) => {
  return (
    <Fragment>
      <VerticalSpace/>
      <Typography variant="h6">Blockstack Profile</Typography>
      {(!!blockstackUser.profile && !!blockstackUser.profile.username) ? <Typography>username: {blockstackUser.profile.username}</Typography>:''}
      {(blockstackUser.isAuthenticated) ? <BlockstackLogout /> : <BlockstackLogin />}
      {(blockstackUser.isAuthenticated) ? <GaiaLinkList /> : <Fragment />}
    </Fragment>
  )
}

export default connect(mapStateToProps)(BlockstackProfile)