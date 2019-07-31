import React from 'react'
import PropTypes from 'prop-types'
import { RemoveCircle } from '@material-ui/icons'
import IconButton from '@material-ui/core/IconButton'

const RemoveClassifier = ({ onClick, id }) => (
  <IconButton title={`delete ${id}`} onClick={onClick}>
    <RemoveCircle></RemoveCircle>
  </IconButton>
)

RemoveClassifier.propTypes = {
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
}

export default RemoveClassifier
