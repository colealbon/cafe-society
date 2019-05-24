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
