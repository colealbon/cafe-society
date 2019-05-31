import * as blockstack from 'blockstack'
// import { fetchBlockstackFeeds } from './feedActions'
// import { fetchBlockstackFilters } from './filterActions'
var memoize = require("memoizee");

export const CONTACT_SELECT_CONTACT = 'CONTACT_SELECT_CONTACT'

export const selectContact = contact => {
  return (dispatch) => {
    dispatch({
      type: CONTACT_SELECT_CONTACT,
      payload: contact
    })
  }
}

export const CONTACT_UPDATE_CONTACT = 'CONTACT_UPDATE_CONTACT'

export const updateContact = text => {
  return (dispatch) => {
    dispatch({
      type: CONTACT_UPDATE_CONTACT,
      payload: {name: text}
    })
  }
}

export const CONTACTS_ADD_CONTACT = 'CONTACTS_ADD_CONTACT'

export const addContact = name => {
  return (dispatch) => {
    dispatch({
      type: CONTACTS_ADD_CONTACT,
      payload: {
        id: name.toLowerCase().replace(' ', '-'),
        name: name
      }
    })
    updateContact({name: ''})
  }
}

export const CONTACTS_REMOVE_CONTACT = 'CONTACTS_REMOVE_CONTACT'

export const removeContact = contact => {
  return (dispatch) => {
    dispatch({
      type: CONTACTS_REMOVE_CONTACT,
      payload: contact
    })
  }
}

export const CONTACTS_TOGGLE_CONTACT = 'CONTACTS_TOGGLE_CONTACT'

export const toggleContact = contact => {
  return (dispatch) => {
    dispatch({
      type: CONTACTS_TOGGLE_CONTACT,
      payload: contact
    })
  }
}

export const PUBLISH_CONTACTS_REQUEST = 'PUBLISH_CONTACTS_REQUEST'
export const PUBLISH_CONTACTS_SUCCESS = 'PUBLISH_CONTACTS_SUCCESS'
export const PUBLISH_CONTACTS_ERROR = 'PUBLISH_CONTACTS_ERROR'
export const FETCH_CONTACTS_REQUEST = 'FETCH_CONTACTS_REQUEST'
export const FETCH_CONTACTS_SUCCESS = 'FETCH_CONTACTS_SUCCESS'
export const FETCH_CONTACTS_ERROR = 'FETCH_CONTACTS_ERROR'

const slowBlockstackGetFile = (filename, options) => blockstack.getFile(filename, options)
const blockstackGetFile = memoize(slowBlockstackGetFile, { maxAge: 10000 })

export const fetchBlockstackContacts = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_CONTACTS_REQUEST })
    const defaultContacts = [
      {id: "astrologer.id", name:"astrologer.id"}
    ]
    if (blockstack.isUserSignedIn()) {
      return blockstackGetFile('contacts.json', {decrypt: true})
      .then( fileContent => {
        if (JSON.parse(fileContent).length > 0) {
          const contacts = JSON.parse(fileContent)
          dispatch({
            type: FETCH_CONTACTS_SUCCESS,
            payload: contacts
          })
          // dispatch(fetchBlockstackFeeds(contacts))
          // dispatch(fetchBlockstackFilters(contacts))
        } else {
          // dispatch({
          //   type: FETCH_CONTACTS_SUCCESS,
          //   payload: defaultContacts
          // })
          // dispatch(fetchBlockstackFeeds(defaultContacts))
          // dispatch(fetchBlockstackFilters(defaultContacts))
        }
      })
      .catch(() => {
        dispatch({
          type: FETCH_CONTACTS_SUCCESS,
          payload: defaultContacts
        })
        // dispatch(fetchBlockstackFeeds(defaultContacts))
        // dispatch(fetchBlockstackFilters(defaultContacts))
      })
    }
  }
}

export const publishContacts = (contacts) => {
  return (dispatch) => {
    dispatch({
      type: PUBLISH_CONTACTS_REQUEST,
      payload: contacts
    })
    const fileContent = JSON.stringify(contacts)
    return blockstack.putFile('contacts.json', fileContent, {encrypt: true})
      .then(() => {
        dispatch({
          type: PUBLISH_CONTACTS_SUCCESS
        })
      }
    )
  }
}
