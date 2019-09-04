import React, {Fragment} from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'
import { handleLeftDrawerClose } from '../../actions/sideDrawerActions'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import { ThumbsUpDown } from '@material-ui/icons'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import NewspaperIcon from '@material-ui/icons/ViewHeadline'
import RssFeedIcon from '@material-ui/icons/RssFeed'
import ListItemText from '@material-ui/core/ListItemText'
import FilterListIcon from '@material-ui/icons/FilterList'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ContactsIcon from '@material-ui/icons/Contacts'
import MoneyIcon from '@material-ui/icons/Money'
import ReceiptIcon from '@material-ui/icons/Receipt'

// import IdentityIcon from '@material-ui/icons/PermIdentity'

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

export const LeftDrawer = ({ leftDrawer, handleDrawerClose, blockstackUser }) => {
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
      <List subheader={<ListSubheader>Edit Settings</ListSubheader>}>
        <ListItem onClick={() => handleDrawerClose()} button key='/section-list' component={Link} to='/section-list'>
          <ListItemIcon><NewspaperIcon/></ListItemIcon>
          <ListItemText primary="Sections" />
        </ListItem>
        <ListItem onClick={() => handleDrawerClose()} button key='/feed-list' component={Link} to='/feed-list'>
          <ListItemIcon><RssFeedIcon/></ListItemIcon>
          <ListItemText primary="Feeds" />
        </ListItem>
        <ListItem onClick={() => handleDrawerClose()} button key='/filter-list' component={Link} to='/filter-list'>
          <ListItemIcon><FilterListIcon/></ListItemIcon>
          <ListItemText primary="Filters" />
        </ListItem>
        <ListItem onClick={() => handleDrawerClose()} button key='/classifier-list' component={Link} to='/classifier-list'>
          <ListItemIcon><ThumbsUpDown/></ListItemIcon>
          <ListItemText primary="Classifiers" />
        </ListItem>
        <ListItem onClick={() => handleDrawerClose()} button key='/contact-list' component={Link} to='/contact-list'>
          <ListItemIcon><ContactsIcon/></ListItemIcon>
          <ListItemText primary="Contacts" />
        </ListItem>
      </List>
      <Divider />
      <List subheader={<ListSubheader>Identity (experimental)</ListSubheader>}>
        <ListItem onClick={() => handleDrawerClose()} button key='blockstack-profile' component={Link} to='/blockstack-profile'>
          <ListItemIcon><AccountCircleIcon/></ListItemIcon>
          <ListItemText primary="Blockstack Profile" />
        </ListItem>
        {
          (blockstackUser.isAuthenticated) ? 
          <ListItem onClick={() => handleDrawerClose()} button key='/manifest-list' component={Link} to='/manifest-list'>
            <ListItemIcon><ReceiptIcon/></ListItemIcon>
            <ListItemText primary="Manifests" />
          </ListItem> :
          <Fragment />
        }
      </List>
      <Divider />
      <List subheader={<ListSubheader>Project / Community</ListSubheader>}>
        <ListItem onClick={() => handleDrawerClose()} button key='/about-us' component={Link} to='/about-us'>
          <ListItemIcon><MoneyIcon/></ListItemIcon>
          <ListItemText primary="About Us" />
        </ListItem>
      </List>
      <Divider />
      <List subheader={<ListSubheader>Customization/Training</ListSubheader>}>
        <ListItem onClick={() => handleDrawerClose()} button key='/enhanced-content' component={Link} to='/enhanced-content'>
          <ListItemIcon><NewspaperIcon/></ListItemIcon>
          <ListItemText primary="Enhanced Content View" />
        </ListItem>
      </List>
    </Drawer>
  )
}
LeftDrawer.propTypes = {
  leftDrawer: PropTypes.object.isRequired,
  handleDrawerClose: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftDrawer)
