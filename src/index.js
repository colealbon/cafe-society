import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { fetchUserData } from './actions/blockstackUserActions'
import { fetchAccounts } from './actions/contractActions'
import { fetchBlockstackFeeds } from './actions/feedActions'
import { fetchBlockstackFilters } from './actions/filterActions'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { createBrowserHistory } from 'history'
import { ConnectedRouter, connectRouter, routerMiddleware} from 'connected-react-router'
import developerFundReducer from './reducers/developerFundReducer'
import sectionsReducer from './reducers/sectionsReducer'
import leftDrawerReducer from './reducers/leftDrawerReducer'
import selectedSectionReducer from './reducers/selectedSectionReducer'
import feedsReducer from './reducers/feedsReducer'
import feedReducer from './reducers/feedReducer'
import contactsReducer from './reducers/contactsReducer'
import contactReducer from './reducers/contactReducer'
import filtersReducer from './reducers/filtersReducer'
import filterReducer from './reducers/filterReducer'
import fieldsReducer from './reducers/fieldsReducer'
import accountsReducer from './reducers/accountsReducer'
import articlesReducer from './reducers/articlesReducer'
import blockstackUserReducer from './reducers/blockstackUserReducer'
import loadingReducer from './reducers/loadingReducer'
import App from './components/App'
import Loading from './components/Loading'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { persistStore, persistReducer } from 'redux-persist'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './theme'
import sectionReducer from './reducers/sectionReducer'
import { fetchArticles } from './actions/articleActions'
import { fetchBlockstackContacts } from './actions/contactActions'
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage/src'
import * as blockstack from "blockstack";

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const history = createBrowserHistory()
const middleware = routerMiddleware(history)

const rootReducer = combineReducers({
  articles: articlesReducer,
  accounts: accountsReducer,
  selectedSection: selectedSectionReducer,
  developerFund: developerFundReducer,
  leftDrawer: leftDrawerReducer,
  sections: sectionsReducer,
  section: sectionReducer,
  feeds: feedsReducer,
  feed: feedReducer,
  filters: filtersReducer,
  filter: filterReducer,
  fields: fieldsReducer,
  contacts: contactsReducer,
  contact: contactReducer,
  loading: loadingReducer,
  blockstackUser: blockstackUserReducer,
  router: connectRouter(history)
})

const rootPersistIndexedDbConfig = {
  key: "root",
  storage: createIdbStorage({name: 'cafe-society', storeName: 'idb-cafe-society-redux'}),
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  blacklist: ['router', 'leftDrawer', 'blockstackUser'] //  will not be persisted
}

let persistedRootReducer = persistReducer(rootPersistIndexedDbConfig, rootReducer)

const store = createStore(
  persistedRootReducer,
  composeWithDevTools(
    applyMiddleware(middleware, createLogger(), thunkMiddleware)
  )
)

const runInitialAppStartActions = () => {
  if (!!store.getState().feeds) {
    store.dispatch(fetchArticles(store.getState().feeds, store.getState().filters))
  }
  if(!!store.getState().blockstackUser) {
    if (store.getState().blockstackUser.isAuthenticated) {
      store.dispatch(fetchUserData())
    }
  }
  if(!!store.getState().contacts) {
    store.dispatch(fetchBlockstackFeeds(store.getState().contacts, store.getState().filters, store.getState().feeds))
    store.dispatch(fetchBlockstackContacts(store.getState().contacts))
  }
  store.dispatch(fetchBlockstackFilters(store.getState().contacts))
  store.dispatch(fetchAccounts())
}

export const persistor = persistStore(store)
ReactDOM.render(
  <Provider store={store}>
     <PersistGate loading={<Loading />} persistor={persistor} onBeforeLift={runInitialAppStartActions}>
        <ConnectedRouter history={history}>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </MuiThemeProvider>
        </ConnectedRouter>
      </PersistGate>    
  </Provider>,
  document.getElementById('root')
)
setTimeout(store.dispatch(fetchAccounts()), 4000)
store.dispatch(fetchUserData())
