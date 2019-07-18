import React, { Fragment } from 'react'
import Typography from '@material-ui/core/Typography'
import VerticalSpace from '../VerticalSpace'
import BlockstackLogin from '../BlockstackLogin'
import BlockstackLogout from '../BlockstackLogout'
import { connect } from 'react-redux'
import Link from '@material-ui/core/Link';

const mapStateToProps = ({blockstackUser}) => {
  return {
      blockstackUser: !!blockstackUser ? blockstackUser : {}
  }
}

export const BlockstackProfile = ({blockstackUser}) => {

  // NOTE TO SELF ******
  // FiltersURL and feedsURL should each be a reducer because we cant persist blockstackUser

  return (
    <Fragment>
      <VerticalSpace/>
      <Typography variant="h6">Blockstack Profile</Typography>
      {(!!blockstackUser.profile && !!blockstackUser.profile.username) ? <Typography>username: {blockstackUser.profile.username}</Typography>:''}
      {(!!blockstackUser.feedsUrl) ? <Typography>feeds url: <Link href={blockstackUser.filtersUrl}>{blockstackUser.filtersUrl}</Link></Typography>:''}
      {(!!blockstackUser.filtersUrl) ? <Typography>filters url: <Link href={blockstackUser.filtersUrl}>{blockstackUser.filtersUrl}</Link></Typography>:''}
      {(!!blockstackUser.contactsUrl) ? <Typography>contacts url: <Link href={blockstackUser.contactsUrl}>{blockstackUser.contactsUrl}</Link></Typography>:''}
      {(!!blockstackUser.articlesUrl) ? <Typography>articles url: <Link href={blockstackUser.articlessUrl}>{blockstackUser.articlessUrl}</Link></Typography>:''}
      {(blockstackUser.isAuthenticated) ? <BlockstackLogout /> : <BlockstackLogin />}
    </Fragment>
  )
}

export default connect(mapStateToProps)(BlockstackProfile)