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
    const newContacts = Object.assign(contacts.filter((contactItem) => contactItem.id !== name).concat({ id: contact, name: contact,  muted: false }))
    dispatch(publishContacts(newContacts))
  }
}

export const CONTACTS_REMOVE_CONTACT = 'CONTACTS_REMOVE_CONTACT'

export const removeContact = contact => {
  return (dispatch) => {
    dispatch({
      type: CONTACTS_REMOVE_CONTACT,
      payload: contact
    })
    const newContacts = Object.assign(contacts.filter((filterContact) => filterContact.id !== contact.id))
    dispatch(publishContacts(newContacts))
  }
}

export const CONTACTS_TOGGLE_CONTACT = 'CONTACTS_TOGGLE_CONTACT'

export const toggleContact = (contact, contacts) => {
  return (dispatch) => {
    dispatch({
      type: CONTACTS_TOGGLE_CONTACT,
      payload: {
        contact: contact,
        contacts: contacts
      }
    })
    const newContacts = contacts.filter((contactItem) => contactItem.id !== contact.id).concat({ ...contact , muted: !contact.muted || false })
    dispatch(publishContacts(newContacts))
  }
}

export const PUBLISH_CONTACTS_REQUEST = 'PUBLISH_CONTACTS_REQUEST'
export const PUBLISH_CONTACTS_SUCCESS = 'PUBLISH_CONTACTS_SUCCESS'
export const PUBLISH_CONTACTS_ERROR = 'PUBLISH_CONTACTS_ERROR'

export const publishContacts = (contacts) => {
  if (!!contacts) {
    return (dispatch) => {
      dispatch({
        type: PUBLISH_CONTACTS_REQUEST,
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

export const FETCH_CONTACTS_REQUEST = 'FETCH_CONTACTS_REQUEST'
export const FETCH_CONTACTS_SUCCESS = 'FETCH_CONTACTS_SUCCESS'
export const FETCH_CONTACTS_ERROR = 'FETCH_CONTACTS_ERROR'

const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { maxAge: 10000 })

export const fetchBlockstackContacts = (contacts) => {
  return (dispatch) => {
    dispatch({ 
      type: FETCH_CONTACTS_REQUEST,
      payload: {contacts: contacts}
     })
    const fetchContactFileQueue = []
    fetchContactFileQueue.push(new Promise((resolve) => {
      blockstackGetFile('contacts.json', {
        decrypt: false,
      })
      .then((fileContents) => {
        if (fileContents === null) {
          resolve([])
        } else {
          resolve(
            JSON.parse(fileContents)
            .map((contact) => {
              return(contact)
            }).concat(contacts)
          )
        }
      })
      .catch(() => {
        resolve([])
      })
    }))
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
          type: 'FETCH_CONTACT_FAILURE',
          payload: 'no contacts found'
        })
      }
    })
  }
}