import React from 'react'
import PropTypes from 'prop-types'
import { RemoveCircle } from '@material-ui/icons'
import IconButton from '@material-ui/core/IconButton'

const RemoveFilter = ({ onClick, text }) => (
  <IconButton title={`delete ${text}`} onClick={onClick}>
    <RemoveCircle></RemoveCircle>
  </IconButton>
)

RemoveFilter.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default RemoveFilter
