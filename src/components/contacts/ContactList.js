import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import VerticalSpace from '../VerticalSpace'
import AddContact from './AddContact'
import RemoveContact from './RemoveContact'
import { removeContact, toggleContact } from '../../actions/contactActions'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Switch from '@material-ui/core/Switch'

import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'

const mapStateToProps = ({ contacts }) => {
  return {
    contacts: contacts
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickRemoveContact: (contact) => {
      dispatch(removeContact(contact))
    },
    handleClickToggleContact: (contact, contacts) => {
      dispatch(toggleContact(contact, contacts))
    },
    handleClickRemoveAllContacts: (contacts) => {
      contacts.map((contact) => dispatch(removeContact(contact)))
    }
  }
}

export const ContactList = ({ handleClickRemoveContact, handleClickToggleContact, handleClickRemoveAllContacts, contacts }) => {
  const deleteSweepContact = `delete: ${[].concat(contacts).length}`
  return (
    <Fragment>
      <VerticalSpace/>
      <List subheader={<ListSubheader>Edit Contacts</ListSubheader>} >
        <ListItem key='addItem'>
          <IconButton title={deleteSweepContact} onClick={() => { handleClickRemoveAllContacts(contacts) }}>
            <DeleteSweepIcon></DeleteSweepIcon>
          </IconButton>
          <AddContact />
        </ListItem>
        {contacts.map((contact) => {
          return (
            <ListItem key={contact.id}>
              <ListItemIcon>
                <RemoveContact
                  {...contact}
                  onClick={() => {
                    handleClickRemoveContact(contact)
                  }}
                />
              </ListItemIcon>
              <span
                onClick={() => {
                  handleClickToggleContact(contact, contacts)
                }}
                title={contact.muted ? `enable ${contact.name}` : `disable ${contact.name}` }
              >
                <Switch checked={!contact.muted} />
              </span>
              <ListItemText primary={contact.name} />
            </ListItem>
          )
        }).reverse()
        }
      </List>
    </Fragment>
  )
}

ContactList.propTypes = {
  handleClickRemoveContact: PropTypes.func.isRequired,
  handleClickToggleContact: PropTypes.func.isRequired,
  handleClickRemoveAllContacts: PropTypes.func.isRequired,
  contacts: PropTypes.array.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactList)
