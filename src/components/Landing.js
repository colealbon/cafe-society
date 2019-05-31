import React, { Component, Fragment  } from 'react'
import { UserSession } from 'blockstack'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class Landing extends Component {

  constructor() {
    super()
    this.userSession = new UserSession()
  }

  signIn(e) {
    e.preventDefault()
    this.userSession.redirectToSignIn()
  }

  render() {
    return (
      <Fragment style={{justifyContent: 'center'}}>
        <br />
        <br />
        <Typography>
          &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          Welcome to cafe-society.news
        </ Typography>
        <br />
        <br />
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        <Button
          variant="outlined"
          color="primary"
          onClick={this.signIn.bind(this)}
        >Sign in with Blockstack
        </Button>
      </Fragment>
    );
  }
}

export default Landing
