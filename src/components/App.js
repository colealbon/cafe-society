import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import AccountList from './AccountList'

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
    </Fragment>
  );
};

export default connect(mapStateToProps)(App);
