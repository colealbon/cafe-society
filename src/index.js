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
import blue from '@material-ui/core/colors/blue';
import { fetchAccounts } from './actions/contractActions';

import messageReducer from './reducers/messageReducer'
import accountsReducer from './reducers/accountsReducer'
import sectionsReducer from './reducers/sectionsReducer'

import App from './components/App'

import registerServiceWorker from './registerServiceWorker'

const history = createBrowserHistory()

const middleware = routerMiddleware(history)
const theme = createMuiTheme({
  palette: {
    primary: blue,
  },  typography: {
      useNextVariants: true,
    }
});


const store = createStore(
  combineReducers({
    message: messageReducer,
    accounts: accountsReducer,
    sections: sectionsReducer
  }),
  composeWithDevTools(
    applyMiddleware(middleware, createLogger(), thunkMiddleware)
  )
)

setTimeout(store.dispatch(fetchAccounts()),100)
setInterval(function(){store.dispatch(fetchAccounts())}, 60000) // 60 seconds

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker();
