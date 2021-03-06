import React from 'react'
import PropTypes from 'prop-types'
import { RemoveCircle } from '@material-ui/icons'
import IconButton from '@material-ui/core/IconButton'

const RemoveContact = ({ onClick, name }) => (
  <IconButton title={`delete ${name}`} onClick={onClick}>
    <RemoveCircle></RemoveCircle>
  </IconButton>
)

RemoveContact.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
}

export default RemoveContact
