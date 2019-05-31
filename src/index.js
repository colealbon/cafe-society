import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme';
import CssBaseline from '@material-ui/core/CssBaseline';

import { fetchAccounts } from './actions/contractActions';

import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
const history = createBrowserHistory()
const middleware = routerMiddleware(history)

import { fetchUserData } from './actions/blockstackUserActions'
import { fetchBlockstackContacts } from './actions/contactActions'

import messageReducer from './reducers/messageReducer'
import accountsReducer from './reducers/accountsReducer'
import sectionsReducer from './reducers/sectionsReducer'
import leftDrawerReducer from './reducers/leftDrawerReducer'
import sectionReducer from './reducers/sectionReducer'
import feedsReducer from './reducers/feedsReducer'
import feedReducer from './reducers/feedReducer'
import filtersReducer from './reducers/filtersReducer'
import filterReducer from './reducers/filterReducer'
import contactsReducer from './reducers/contactsReducer'
import contactReducer from './reducers/contactReducer'
import selectedSectionReducer from './reducers/selectedSectionReducer'
import blockstackUserReducer from './reducers/blockstackUserReducer'
import selectedFilterSectionReducer from './reducers/selectedFilterSectionReducer'

const store = createStore(
  combineReducers({
    message: messageReducer,
    accounts: accountsReducer,
    sections: sectionsReducer,
    section: sectionReducer,
    contacts: contactsReducer,
    contact: contactReducer,
    feeds: feedsReducer,
    feed: feedReducer,
    filter: filterReducer,
    filters: filtersReducer,
    selectedSection: selectedSectionReducer,
    leftDrawer: leftDrawerReducer,
    selectedFilterSection: selectedFilterSectionReducer,
    blockstackUser: blockstackUserReducer,
    router: connectRouter(history),
  }),
  composeWithDevTools(
    applyMiddleware(middleware, createLogger(), thunkMiddleware)
  )
)

setTimeout(store.dispatch(fetchAccounts()), 1000)
setInterval(function(){store.dispatch(fetchAccounts())}, 60 * 1000) // miliseconds
store.dispatch(fetchUserData())
store.dispatch(fetchBlockstackContacts())


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
