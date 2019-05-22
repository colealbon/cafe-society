import React, { Component } from "react"
import ReactDOM from "react-dom"
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { createMuiTheme } from '@material-ui/core/styles';

import { fetchAccounts } from './actions/contractActions';

import messageReducer from './reducers/messageReducer'
import accountsReducer from './reducers/accountsReducer'

import App from './components/App'

import registerServiceWorker from './registerServiceWorker'

const history = createBrowserHistory()

const middleware = routerMiddleware(history)

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
})

const store = createStore(
  combineReducers({
    message: messageReducer,
    accounts: accountsReducer
  }),
  composeWithDevTools(
    applyMiddleware(middleware, createLogger(), thunkMiddleware)
  )
)

store.dispatch(fetchAccounts())
setInterval(function(){store.dispatch(fetchAccounts())}, 5000)

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker();
