import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import Home from './Home'
Home.displayName = 'home'

export const App = () => <Home />

export default connect()(App)
