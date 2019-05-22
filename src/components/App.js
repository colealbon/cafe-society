import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import AccountList from './AccountList'
import Sections from './Sections'
import SectionList from './sections/SectionList'

const mapStateToProps = ({ message }) => {
  return {
    text: message.text
  };
};

export const App = ({ text }) => {
  return (
    <Fragment>
      <Typography>
        { text }
      </Typography>
      <AccountList></AccountList>
      <SectionList></SectionList>
    </Fragment>
  );
};

export default connect(mapStateToProps)(App);
