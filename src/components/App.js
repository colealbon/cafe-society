import React, { Component } from 'react'
import { UserSession } from 'blockstack'
import FrontPage from './FrontPage'

class App extends Component {

  constructor() {
    super()
    this.userSession = new UserSession()
  }

  componentWillMount() {
    const session = this.userSession
    if(!session.isUserSignedIn() && session.isSignInPending()) {
      session.handlePendingSignIn()
      .then((userData) => {
        window.location = '/'
      })
    }
  }

  render() {
    return (
      <main role="main">
        <FrontPage />
      </main>
    );
  }
}

export default App
