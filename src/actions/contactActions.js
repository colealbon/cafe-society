import * as blockstack from 'blockstack'
var memoize = require("memoizee")

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

export const updateContact = contact => {
  return (dispatch) => {
    dispatch({
      type: CONTACT_UPDATE_CONTACT,
      payload: contact
    })
  }
}

export const PUBLISH_CONTACTS_START = 'PUBLISH_CONTACTS_START'
export const PUBLISH_CONTACTS_SUCCESS = 'PUBLISH_CONTACTS_SUCCESS'
export const PUBLISH_CONTACTS_ERROR = 'PUBLISH_CONTACTS_ERROR'

export const publishContacts = (contacts) => {
  if (!!contacts) {
    return (dispatch) => {
      dispatch({
        type: PUBLISH_CONTACTS_START,
        payload: contacts
      })
      const fileContent = JSON.stringify(contacts)
      return blockstack.putFile('contacts.json', fileContent, {encrypt: false})
      .then((response) => {
        dispatch({
          type: PUBLISH_CONTACTS_SUCCESS,
          payload: {
            response: response,
            contacts: contacts
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: PUBLISH_CONTACTS_ERROR,
          payload: {
            error: error
          }
        })
      })
    }
  }
}

export const CONTACTS_ADD_CONTACT = 'CONTACTS_ADD_CONTACT'

export const addContact = (contact, contacts) => {
  return (dispatch) => {
    dispatch({
      type: CONTACTS_ADD_CONTACT,
      payload: {
        id: contact,
        name: contact,
        muted: false
      }
    })
    dispatch(updateContact(''))
    dispatch(publishContacts(contacts.filter((contactItem) => contactItem.id !== name).concat({ id: contact, name: contact,  muted: false })))
  }
}

export const CONTACTS_REMOVE_CONTACT = 'CONTACTS_REMOVE_CONTACT'

export const removeContact = (contact, contacts) => {
  return (dispatch) => {
    dispatch({
      type: CONTACTS_REMOVE_CONTACT,
      payload: contact
    })
    dispatch(publishContacts(contacts.filter((filterContact) => filterContact.id !== contact.id)))
  }
}

export const CONTACTS_TOGGLE_CONTACT = 'CONTACTS_TOGGLE_CONTACT'

export const toggleContact = (contact, contacts) => {
  return (dispatch) => {
    dispatch({
      type: CONTACTS_TOGGLE_CONTACT,
      payload: contact
    })
    dispatch(publishContacts(contacts.map(contactItem => contactItem.id == contact.id ? { ...contactItem, muted: !contactItem.muted || false } : contactItem)))
  }
}

export const FETCH_CONTACTS_START = 'FETCH_CONTACTS_START'
export const FETCH_CONTACTS_SUCCESS = 'FETCH_CONTACTS_SUCCESS'
export const FETCH_SAVED_CONTACTS_SUCCESS = 'FETCH_SAVED_CONTACTS_SUCCESS'
export const FETCH_CONTACTS_ERROR = 'FETCH_CONTACTS_ERROR'
export const FETCH_SAVED_CONTACTS_ERROR = 'FETCH_SAVED_CONTACTS_ERROR'

const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { maxAge: 10000 })

export const fetchBlockstackContacts = (contacts) => {
  return (dispatch) => {
    dispatch({ 
      type: FETCH_CONTACTS_START,
      payload: {contacts: contacts}
     })
    const fetchContactFileQueue = []
    fetchContactFileQueue.push(new Promise((resolve) => {
      blockstackGetFile('contacts.json', {
        decrypt: false,
      })
      .then((fileContents) => {
        dispatch({
          type: FETCH_SAVED_CONTACTS_SUCCESS,
          payload: JSON.parse(fileContents)
        })
        resolve(JSON.parse(fileContents))
      })
      .catch((error) =>{
        dispatch({
          type: FETCH_SAVED_CONTACTS_ERROR,
          payload: {error: error}
        })
      })
    }))
    // fetch feeds from each contact
    if (!!contacts && contacts.length > 0) {
      contacts.filter((contactItem) => !contactItem.muted).map((contactItem) => {
        return fetchContactFileQueue.push(new Promise((resolve) => {
          blockstackGetFile('contacts.json', {
            decrypt: false,
            username: contactItem.name
          })
          .then((fileContents) => {
            if (fileContents === null) {
              resolve([])
            } else {
              resolve(
                JSON.parse(fileContents)
                .map((fetchedContact) => {
                  fetchedContact.source_contact = Object.assign(contactItem)
                  fetchedContact.muted = true
                  return(fetchedContact)
                }).concat(contacts)
              )
            }
          })
          .catch(() => {
            resolve([])
          })
        }))
      })
    }

    Promise.all(fetchContactFileQueue)
    .then((fetchedContacts) => {
      const flattenedContacts = fetchedContacts.reduce((a, b) => !a ? b : [].concat(a).concat(b))
      let dedup = {}
      const uniqueContacts = []
      if ((flattenedContacts || []).length !== 0) {
        flattenedContacts.filter((contact) => {
          if (dedup[contact.id] === undefined) {
            dedup[contact.id] = {}
            uniqueContacts.push(contact)
            return true
          }
          return false
        })
        dispatch({
          type: FETCH_CONTACTS_SUCCESS,
          payload: uniqueContacts
        })
        dispatch(publishContacts(uniqueContacts))
      } else {
        dispatch({
          type: FETCH_CONTACTS_ERROR,
          payload: 'no contacts found'
        })
      }
    })
  }
}