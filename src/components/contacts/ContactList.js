import React, { Fragment } from "react"
import { connect } from 'react-redux'
import AddContact from './AddContact'
import RemoveContact from './RemoveContact'
import { removeContact, toggleContact } from '../../actions/contactActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from 'mdi-react/DeleteSweepIcon'

import Loading from '../Loading';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';

const mapStateToProps = ({ contacts }) => {
  return {
    contacts: contacts
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleClickRemoveContact: (contact) => {
      dispatch(removeContact(contact))
    },
    handleClickToggleContact: (contact) => {
      dispatch(toggleContact(contact))
    },
    handleClickRemoveAllContacts: (contacts) => {
      contacts.map((contact) => dispatch(removeContact(contact)))
    }
  }
}

export const ContactList = ({ handleClickRemoveContact, handleClickToggleContact, handleClickRemoveAllContacts, publishContacts, contacts, ...rest}) => {
  const deleteSweepContact = `delete: ${[].concat(contacts).length}`
  return (
    <Fragment>
    <br />
    <br />
    <br />
    <br />
      <List subheader={<ListSubheader>Edit Contacts</ListSubheader>} >
        <ListItem key='addItem'>
          <IconButton title={deleteSweepContact} onClick={() => {handleClickRemoveAllContacts(contacts)}}>
            <DeleteSweepIcon></DeleteSweepIcon>
          </IconButton>
          <AddContact />
          <Loading />
        </ListItem>
        {contacts.map((contact) => {
          return (
            <ListItem key={contact.id}>
              <RemoveContact
                {...contact}
                onClick={() => {
                  handleClickRemoveContact(contact)
                }}
              />
              <span
                onClick={() => {
                  handleClickToggleContact(contact)
                }}
                title={contact.muted ? `enable ${contact.name}` : `disable ${contact.name}` }
              >
              <Switch checked={!contact.muted}  />
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactList);
