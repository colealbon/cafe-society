import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import Home from './Home'

export const App = () => <Home />

export default connect()(App)
