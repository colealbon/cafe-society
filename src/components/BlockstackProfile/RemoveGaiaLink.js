import React from 'react'
import PropTypes from 'prop-types'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
import IconButton from '@material-ui/core/IconButton'

const RemoveGaiaLink = ({ onClick, name }) => (
  <IconButton title="delete gaiaLink" onClick={onClick}>
    <RemoveCircle></RemoveCircle>
  </IconButton>
)

RemoveGaiaLink.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
}

export default RemoveGaiaLink
