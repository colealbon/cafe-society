import React, { Component, Fragment  } from 'react'
import { UserSession } from 'blockstack'
import Button from '@material-ui/core/Button';

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
      <Fragment>
        <br />
        <br />
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
