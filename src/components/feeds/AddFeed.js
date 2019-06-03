import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { Add } from '@material-ui/icons'
import { addFeed, updateFeed} from '../../actions/feedActions'
import IconButton from '@material-ui/core/IconButton'

const mapStateToProps = ({feed}) => {
  if (!feed) {
    return {url: ''}
  }
  return {
    url: feed.url
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickAddFeed: (url) => {
      dispatch(addFeed(url))
      dispatch(updateFeed(''))
    },
    handleInputChange: (evt) => {
      const url = evt.target.value
      dispatch(updateFeed(url))
    }
  }
}

const AddFeed = ({ handleClickAddFeed, handleInputChange, url }) => {
  return (
    <Fragment>
      <IconButton title="add new feed" onClick={() => handleClickAddFeed(url)} >
        <Add id='addFeed' />
      </IconButton>
      <TextField
        label='enter feed url'
        id='textFieldFeed'
        onChange={handleInputChange}
        value={url}
        placeholder="https://theintercept.com/feed/?rss"
      />
    </Fragment>
  )
}

AddFeed.propTypes = {
  handleClickAddFeed: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(AddFeed)
