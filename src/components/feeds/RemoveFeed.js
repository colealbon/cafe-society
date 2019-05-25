import React from 'react'
import PropTypes from 'prop-types'
import { RemoveCircle } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';

const RemoveFeed = ({ onClick, url }) => (
  <IconButton title={`delete ${url}`} onClick={onClick}>
    <RemoveCircle></RemoveCircle>
  </IconButton>
)

RemoveFeed.propTypes = {
  onClick: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired
}

export default RemoveFeed
