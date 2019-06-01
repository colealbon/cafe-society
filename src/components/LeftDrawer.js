import React from 'react'
import { connect } from 'react-redux'
import { handleLeftDrawerClose } from '../actions/leftDrawerActions'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListSubHeader from '@material-ui/core/ListSubHeader'
import ContactsIcon from '@material-ui/icons/Contacts'
import RssFeedIcon from '@material-ui/icons/RssFeed'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import NewspaperIcon from '@material-ui/icons/ViewHeadline'
import FilterListIcon from '@material-ui/icons/FilterList'
import ListItemText from '@material-ui/core/ListItemText'
import PropTypes from 'prop-types'

import IdentityIcon from '@material-ui/icons/PermIdentity'
import {Link} from 'react-router-dom'

const mapStateToProps = ({ leftDrawer, blockstackUser }) => {
  return {
    leftDrawer: leftDrawer,
    blockstackUser: blockstackUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleDrawerClose: () => {
      dispatch(handleLeftDrawerClose())
    }
  }
}

export const LeftDrawer = ({ leftDrawer, blockstackUser, handleDrawerClose }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={leftDrawer.open}
    >
      <div>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List subheader={<ListSubHeader>Edit Settings</ListSubHeader>}>
        <ListItem onClick={() => handleDrawerClose()} button key='/section-list' component={Link} to='/section-list'>
          <ListItemIcon><NewspaperIcon/></ListItemIcon>
          <ListItemText primary="Sections" />
        </ListItem>
        <ListItem onClick={() => handleDrawerClose()} button key='/contact-list' component={Link} to='/contact-list'>
          <ListItemIcon><ContactsIcon/></ListItemIcon>
          <ListItemText primary="Contacts" />
        </ListItem>
        <ListItem onClick={() => handleDrawerClose()} button key='/feed-list' component={Link} to='/feed-list'>
          <ListItemIcon><RssFeedIcon/></ListItemIcon>
          <ListItemText primary="Feeds" />
        </ListItem>
        <ListItem onClick={() => handleDrawerClose()} button key='/filter-list' component={Link} to='/filter-list'>
          <ListItemIcon><FilterListIcon/></ListItemIcon>
          <ListItemText primary="Filters" />
        </ListItem>
      </List>
      <Divider />
      <List subheader={<ListSubHeader>Identity (experimental)</ListSubHeader>}>
      <ListItem onClick={() => handleDrawerClose()} button key='logout' component={Link} to='/logout'>
        <ListItemIcon><ExitToAppIcon/></ListItemIcon>
        <ListItemText primary={`log out ${blockstackUser.profile.username}`} />
      </ListItem>
        <ListItem onClick={() => handleDrawerClose()} button key='/web3-account-list' component={Link} to='/web3-account-list'>
          <ListItemIcon><IdentityIcon/></ListItemIcon>
          <ListItemText primary="Web3 Provider" />
        </ListItem>
      </List>
    </Drawer>
  )
}
LeftDrawer.propTypes = {
  leftDrawer: PropTypes.object.isRequired,
  blockstackUser: PropTypes.object.isRequired,
  handleDrawerClose: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftDrawer)
