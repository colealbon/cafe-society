import React, { Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import styles from '../../styles'
import { connect } from 'react-redux'
import { Route, Link, Switch } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import MenuIcon from '@material-ui/icons/Menu'
import IconButton from '@material-ui/core/IconButton'
import Tab from '@material-ui/core/Tab'
import PropTypes from 'prop-types'
import AboutUs from '../AboutUs'
import SectionList from '../sections/SectionList'
import FilterList from '../filters/FilterList'
import FeedList from '../feeds/FeedList'
import ContactList from '../contacts/ContactList'
import AccountList from '../AccountList'
import LeftDrawer from './LeftDrawer'
import Logout from '../Logout'
import { handleLeftDrawerOpen } from '../../actions/sideDrawerActions'
import SectionContent from '../articles/SectionContent'
import EnhancedContent from '../articles/EnhancedContent'
import BlockstackProfile from '../BlockstackProfile'
import { selectSection } from '../../actions/sectionActions'


const mapStateToProps = ({leftDrawer, sections}) => {
  return {
    leftDrawer: leftDrawer,
    sections: !!sections ? sections : [{id: 'headlines', name: 'headlines', muted: false}]
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

export const FrontPage = ({handleDrawerOpen, handleSetSection, sections}) => {
  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" color="inherit" noWrap>
          <Toolbar variant="dense">
            <Tab value="/home" label='home' component={Link} to="/" />
            {sections.filter((section) => !section.muted).map((section) => {
              const nameToPath = (name) => {
                return name.toLowerCase().replace(' ', '-')
              }
              return <Tab value={nameToPath(section.name)} key={section.name} label={section.name} onClick={() => handleSetSection(section)} component={Link} to={`/${nameToPath(section.name)}`} />
            }).reverse()}
            <Tab hidden disabled value="/about-us" component={Link} to="/about-us" />
            <Tab hidden disabled value="/" component={Link} to="/" />
            <Tab hidden disabled value="/section-list" component={Link} to="/section-list" />
            <Tab hidden disabled value="/feed-list" component={Link} to="/feed-list" />
            <Tab hidden disabled value="/filter-list" component={Link} to="/filter-list" />
            <Tab hidden disabled value="/web3-account-list" component={Link} to="/web3-account-list" />
            <Tab hidden disabled value="/contact-list" component={Link} to="/contact-list" />
            <Tab hidden disabled value="/enhanced-content" component={Link} to="/enhanced-content" />
            <Tab hidden disabled value="/blockstack-profile" component={Link} to="/blockstack-profile" />
          </Toolbar>
        </Typography>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route exact path="/" component={SectionContent} />
        <Route path="/home" component={SectionContent} />
        <Route path='/section-list' component={SectionList} />
        <Route path="/about-us" component={AboutUs} />
        <Route path='/feed-list' component={FeedList} />
        <Route path='/filter-list' component={FilterList} />
        <Route path='/contact-list' component={ContactList} />
        <Route path='/enhanced-content' component={EnhancedContent} />
        <Route path='/blockstack-profile' component={BlockstackProfile} />
        <Route path='/web3-account-list' component={AccountList} />
        <Route path='/logout' component={Logout} />
        {sections.filter((section) => !section.muted).map((section) => {
          const nameToPath = (name) => {
            return name.toLowerCase().replace(' ', '-')
          }
          return <Route exact key={`/${nameToPath(section.name)}`} path={`/${nameToPath(section.name)}`} component={SectionContent} />
        })}
      </Switch>
      <LeftDrawer />
    </Fragment>
  )
}

FrontPage.propTypes = {
  handleDrawerOpen: PropTypes.func.isRequired
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(FrontPage))
