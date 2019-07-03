import React, { Fragment } from 'react'
import Typography from '@material-ui/core/Typography'
import VerticalSpace from '../VerticalSpace'
import BlockstackLogin from '../BlockstackLogin'
import BlockstackLogout from '../BlockstackLogout'
import { connect } from 'react-redux'

const mapStateToProps = ({blockstackUser}) => {
  return {
      blockstackUser: blockstackUser
  }
}

export const BlockstackProfile = ({blockstackUser}) => {

  // NOTE TO SELF ******
  // FiltersURL and feedsURL should each be a reducer because we cant persist blockstackUser

  return (
    <Fragment>
      <VerticalSpace/>
      <Typography variant="h6">Blockstack Profile</Typography>
      {(!!blockstackUser.profile.username) ? <Typography>username: {blockstackUser.profile.username}</Typography>:''}
      {(!!blockstackUser.feedsUrl) ? <Typography>feeds url: {blockstackUser.feedsUrl}</Typography>:''}
      {(!!blockstackUser.filtersUrl) ? <Typography>filters url: {blockstackUser.filtersUrl}</Typography>:''}
      {(!!blockstackUser.contactsUrl) ? <Typography>contacts url: {blockstackUser.contactsUrl}</Typography>:''}
      {(!!blockstackUser.articlesUrl) ? <Typography>articles url: {blockstackUser.articlesUrl}</Typography>:''}
      {(blockstackUser.isAuthenticated) ? <BlockstackLogout /> : <BlockstackLogin />}
    </Fragment>
  )
}

export default connect(mapStateToProps)(BlockstackProfile)

