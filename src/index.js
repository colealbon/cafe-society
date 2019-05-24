import React, { Component } from "react"
import ReactDOM from "react-dom"
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
// import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme';
import CssBaseline from '@material-ui/core/CssBaseline';

import { fetchAccounts } from './actions/contractActions';

import messageReducer from './reducers/messageReducer'
import accountsReducer from './reducers/accountsReducer'
import sectionsReducer from './reducers/sectionsReducer'
import leftDrawerReducer from './reducers/leftDrawerReducer'
import sectionReducer from './reducers/sectionReducer'

import App from './components/App'

import registerServiceWorker from './registerServiceWorker'

const history = createBrowserHistory()

const middleware = routerMiddleware(history)

const store = createStore(
  combineReducers({
    message: messageReducer,
    accounts: accountsReducer,
    sections: sectionsReducer,
    section: sectionReducer,
    leftDrawer: leftDrawerReducer,
    router: connectRouter(history),
  }),
  composeWithDevTools(
    applyMiddleware(middleware, createLogger(), thunkMiddleware)
  )
)

setTimeout(store.dispatch(fetchAccounts()), 1000)
setInterval(function(){store.dispatch(fetchAccounts())}, 60 * 1000) // miliseconds

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker();
