import 'react-app-polyfill/stable';
import * as serviceWorker from './serviceWorker';
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { createBrowserHistory } from 'history'
import { ConnectedRouter, connectRouter, routerMiddleware, push} from 'connected-react-router'
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage/src'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { persistStore, persistReducer } from 'redux-persist'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import { fetchUserData } from './actions/blockstackUserActions'
import { fetchAccounts } from './actions/contractActions'
import { fetchArticles } from './actions/articleActions'
import { fetchBlockstackContacts } from './actions/contactActions'
import { fetchBlockstackFilters } from './actions/filterActions'
import { fetchBlockstackFeeds } from './actions/feedActions'
import { fetchBlockstackArticles } from './actions/articleActions'
import { fetchBlockstackClassifiers } from './actions/classifierActions'
import { fetchBlockstackSections } from './actions/sectionActions'
import { fetchBlockstackManifests } from './actions/manifestActions'

import developerFundReducer from './reducers/developerFundReducer'
import sectionsReducer from './reducers/sectionsReducer'
import leftDrawerReducer from './reducers/leftDrawerReducer'
import selectedSectionReducer from './reducers/selectedSectionReducer'
import feedsReducer from './reducers/feedsReducer'
import feedReducer from './reducers/feedReducer'
import classifiersReducer from './reducers/classifiersReducer'
import contactsReducer from './reducers/contactsReducer'
import contactReducer from './reducers/contactReducer'
import filtersReducer from './reducers/filtersReducer'
import filterReducer from './reducers/filterReducer'
import fieldsReducer from './reducers/fieldsReducer'
import accountsReducer from './reducers/accountsReducer'
import articlesReducer from './reducers/articlesReducer'
import manifestsReducer from './reducers/manifestsReducer'
import blockstackUserReducer from './reducers/blockstackUserReducer'
import loadingReducer from './reducers/loadingReducer'
import sectionReducer from './reducers/sectionReducer'
import Loading from './components/Loading'
import App from './components/App'

import theme from './theme'

const history = createBrowserHistory()
const middleware = routerMiddleware(history)

const rootReducer = combineReducers({
  articles: articlesReducer,
  accounts: accountsReducer,
  classifiers: classifiersReducer,
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
  manifests: manifestsReducer,
  blockstackUser: blockstackUserReducer,
  router: connectRouter(history)
})

const rootPersistIndexedDbConfig = {
  key: "root",
  storage: createIdbStorage({name: 'cafe-society', storeName: 'idb-cafe-society-redux'}),
  stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
  blacklist: ['router', 'leftDrawer'] //  will not be persisted
}

let persistedRootReducer = persistReducer(rootPersistIndexedDbConfig, rootReducer)

const store = createStore(
  persistedRootReducer,
  composeWithDevTools(
    applyMiddleware(middleware, createLogger({predicate: (getState, action) => !'production'}), thunkMiddleware)
  )
)

const runInitialAppStartActions = () => {
  if(!!store.getState().blockstackUser && store.getState().blockstackUser.isAuthenticated) {
    store.dispatch(fetchBlockstackManifests())
    store.dispatch(fetchBlockstackContacts())
    store.dispatch(fetchBlockstackFilters())
    store.dispatch(fetchBlockstackArticles(store.getState().manifests, store.getState().filters))
    store.dispatch(fetchBlockstackClassifiers())
    store.dispatch(fetchBlockstackSections())
    store.dispatch(fetchBlockstackFeeds())
    setTimeout(() => {
     store.dispatch(fetchArticles(
        store.getState().feeds, 
        store.getState().filters,
        store.getState().manifests
      ))
      store.dispatch(push('/home'))
    }, 2000)
  } else {
    store.dispatch(fetchArticles(
      store.getState().feeds, 
      store.getState().filters,
      store.getState().manifests
    ))
  }
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
setTimeout(store.dispatch(fetchAccounts()), 2000)
store.dispatch(fetchUserData())

// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
serviceWorker.register()
