import React, { Fragment } from "react"
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import { Add } from '@material-ui/icons';
import { addFeed, updateFeed} from '../../actions/feedActions'
import IconButton from '@material-ui/core/IconButton';

const mapStateToProps = ({feed}) => {
  if (!feed) {
    return {url: ''}
  }
  return {
    url: feed.url
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleClickAddFeed: (url) => {
      dispatch(addFeed(url))
      dispatch(updateFeed(''))
    },
    handleInputChange: (evt) => {
      const url = evt.target.value;
      dispatch(updateFeed(url));
    }
  }
}

const AddFeed = ({ handleClickAddFeed, handleInputChange, url, ...rest}) => {
  return (
    <Fragment>
    <IconButton title="add new feed" onClick={() => handleClickAddFeed(url)} >
      <Add id='addFeed' />
    </IconButton>
      <TextField
        id='textFieldFeed'
        onChange={handleInputChange}
        value={url}
        placeholder="https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en"
      />
    </Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AddFeed)
