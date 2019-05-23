import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import AccountList from './AccountList'
import Sections from './Sections'
import Toolbar from '@material-ui/core/Toolbar'
import SectionList from './sections/SectionList'
import { withStyles } from '@material-ui/core/styles'
import { handleLeftDrawerClose } from '../actions/leftDrawerActions'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import ListItemText from '@material-ui/core/ListItemText'
import MailIcon from '@material-ui/icons/Mail'
import AppBar from '@material-ui/core/AppBar'
import MenuIcon from '@material-ui/icons/Menu'

const mapStateToProps = ({ leftDrawer }) => {
  return {
    leftDrawer: leftDrawer
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleDrawerClose: () => {
      dispatch(handleLeftDrawerClose())
    }
  }
}

const drawerWidth = 240;

export const LeftDrawer = ({ leftDrawer, handleDrawerClose }) => {
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
      <List>
        {['Inbox', 'Read', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftDrawer)
