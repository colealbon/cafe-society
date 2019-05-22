import React from 'react'
import PropTypes from 'prop-types'
import { Remove } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';

const RemoveSection = ({ onClick, name }) => (
  <IconButton title="delete section" onClick={onClick}>
    <Remove></Remove>
  </IconButton>
)

RemoveSection.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
}

export default RemoveSection
