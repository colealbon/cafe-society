import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import { Add } from '@material-ui/icons'
import { addContact, updateContact} from '../../actions/contactActions'
import IconButton from '@material-ui/core/IconButton'

const mapStateToProps = ({contact, contacts}) => {
  return {
    contact: !!contact ? contact : '',
    contacts: !!contacts ? contacts : [
      {id: 'cole_albon.id', name: 'cole_albon.id', muted: true}
    ]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickAddContact: (contact, contacts) => {
      dispatch(addContact(contact, contacts))
      dispatch(updateContact(''))
    },
    handleInputChange: (evt) => {
      const contact = evt.target.value
      dispatch(updateContact(contact))
    }
  }
}

const AddContact = ({ handleClickAddContact, handleInputChange, contact, contacts }) => {
  return (
    <Fragment>
      <IconButton title="add new contact" onClick={() => handleClickAddContact(contact, contacts)} >
        <Add id='addContact' />
      </IconButton>
      <TextField
        label='enter blockstack id'
        id='textFieldContact'
        onChange={handleInputChange}
        value={contact}
        placeholder="cole_albon.id"
      />
    </Fragment>
  )
}

AddContact.propTypes = {
  handleClickAddContact: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  contact: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(AddContact)
