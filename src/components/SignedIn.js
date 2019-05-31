import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Route, Link, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import AppBar from '@material-ui/core/AppBar'
import MenuIcon from '@material-ui/icons/Menu'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
// import Button from '@material-ui/core/Button';

import Logout from './blockstack/Logout'
import SectionList from './sections/SectionList'
import ContactList from './contacts/ContactList'
import FeedList from './feeds/FeedList'
import FilterList from './filters/FilterList'
import Content from './Content'
import AccountList from './AccountList'
import LeftDrawer from './LeftDrawer'
import styles from '../styles'
import { handleLeftDrawerOpen } from '../actions/leftDrawerActions'
import { selectSection } from '../actions/sectionActions'

const mapStateToProps = ({ message, sections, leftDrawer, selectedSection }) => {
  return {
    text: message.text,
    sections: sections,
    leftDrawer: leftDrawer,
    selectedSection: selectedSection
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleDrawerOpen: () => {
      dispatch(handleLeftDrawerOpen())
    },
    handleSetSection: (section) => {
      dispatch(selectSection(section))
    }
  }
}

export const SignedIn = ({ sections, handleDrawerOpen, handleSetSection}) => {
  return (
      <div className="App">
        <Route path='/section-list' exact component={SectionList} />
        <Route
          path="/"
          render={() => (
            <Fragment>
              <AppBar
                position="fixed"
              >
                <Toolbar disableGutters={!open}>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={handleDrawerOpen}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" color="inherit" noWrap>
                    <Toolbar variant="dense">
                    <Tab value="/all" label='all' component={Link} to="/all" />
                      <Tabs value='/'>
                        {sections.filter((section) => !section.muted).map((section) => {
                          const nameToPath = (name) => {
                            return name.toLowerCase().replace(' ', '-')
                          }
                          return <Tab value={nameToPath(section.name)} key={section.name} label={section.name} onClick={() => handleSetSection(section)} component={Link} to={`/${nameToPath(section.name)}`} />
                        }).reverse()}
                        <Tab hidden disabled value="/" component={Link} to="/" />
                        <Tab hidden disabled value="/section-list" component={Link} to="/section-list" />
                        <Tab hidden disabled value="/web3-account-list" component={Link} to="/web3-account-list" />
                        <Tab hidden disabled value="/contact-list" component={Link} to="/contact-list" />
                        <Tab hidden disabled value="/feed-list" component={Link} to="/feed-list" />
                        <Tab hidden disabled value="/filter-list" component={Link} to="/filter-list" />
                        <Tab variant="outlined"value="/logout" label='Log Out' component={Link} to="/logout" />
                      </Tabs>
                    </Toolbar>
                  </Typography>
                </Toolbar>
              </AppBar>
              <Switch>
                <Route exact key='/' path='/' component={Content} />
                <Route exact key='/all' path='/all' component={Content} />
                <Route exact key='/web3-account-list' path='/web3-account-list' component={AccountList} />
                <Route exact key='/contact-list' path='/contact-list' component={ContactList} />
                <Route exact key='/filter-list' path='/filter-list' component={FilterList} />
                <Route exact key='/feed-list' path='/feed-list' component={FeedList} />
                <Route path='/logout' exact component={Logout} />
                {sections.filter((section) => !section.muted).map((section) => {
                  const nameToPath = (name) => {
                    return name.toLowerCase().replace(' ', '-')
                  }
                  return <Route exact key={`/${nameToPath(section.name)}`} path={`/${nameToPath(section.name)}`} component={Content} />
                })}
              </Switch>
              <LeftDrawer />
            </Fragment>
          )}
        />
      </div>
  )
}

SignedIn.propTypes = {
  sections: PropTypes.array.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  handleSetSection: PropTypes.func.isRequired
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(SignedIn))
