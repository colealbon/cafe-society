import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Route, Link, BrowserRouter, Switch } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import SectionList from './sections/SectionList'
import IconButton from '@material-ui/core/IconButton'
import AppBar from '@material-ui/core/AppBar'
import MenuIcon from '@material-ui/icons/Menu'
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Content from './Content'
import LeftDrawer from './LeftDrawer'
import styles from '../styles'
import { handleLeftDrawerOpen } from '../actions/leftDrawerActions'
import { selectSection } from '../actions/sectionActions'

const mapStateToProps = ({ message, sections, leftDrawer, section }) => {
  return {
    text: message.text,
    sections: sections,
    leftDrawer: leftDrawer,
    section: section
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleDrawerOpen: () => {
      dispatch(handleLeftDrawerOpen())
    },
    handleSetSection: (section) => {
      dispatch(selectSection(section))
    }
  }
}

export const Home = ({ text, sections, section, leftDrawer, handleDrawerOpen, handleSetSection}) => {
  return (
    <BrowserRouter basename="/" >
      <div className="App">
      <Route path='/section-list' exact component={SectionList} />
      <Route
        path="/"
        render={({ location }) => (
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
                    <Tabs value={(location.pathname === '/') ? '/' : location.pathname}>
                    {sections.map((section) => {
                      return <Tab key={section.id} label={section.name} onClick={()=> handleSetSection(section)} value="/" component={Link} to="/" />
                    })}
                    <Tab disabled value="/section-list" component={Link} to="/section-list" />

                    </Tabs>

                  </Toolbar>
                </Typography>
              </Toolbar>
            </AppBar>
            <Switch>
              <Route path='/' exact component={Content} />
            </Switch>
            <LeftDrawer />
          </Fragment>
        )}
      />
      </div>
    </BrowserRouter>
  )
};

// export default connect(mapStateToProps)(App);
// export default withStyles(styles, { withTheme: true })(PersistentDrawerLeft);
export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Home))
