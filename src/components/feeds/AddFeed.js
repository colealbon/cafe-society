import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { Add } from '@material-ui/icons'
import { addFeed, updateFeed} from '../../actions/feedActions'
import IconButton from '@material-ui/core/IconButton'

const mapStateToProps = ({feed, feeds}) => {
  return {
    feed: !!feed ? feed : '',
    feeds: !!feeds ? feeds : [{
      id: 'https://theintercept.com/feed/?lang=en',
      url: 'https://theintercept.com/feed/?lang=en',
      sections: [
        {
          id: 'politics',
          name: 'politics',
          muted: true
        }
      ],
      muted: true
    },
    {
      id: 'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en',
      url: 'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en'
    },
    {
      id: 'https://www.statnews.com/feed/',
      url: 'https://www.statnews.com/feed/',
      sections: [
        {
          id: 'technology',
          name: 'technology'
        }
      ],
      muted: false
    },
    {
      id: 'https://lifehacker.com/rss',
      url: 'https://lifehacker.com/rss',
      sections: [
        {
          id: 'variety',
          name: 'variety'
        }
      ],
      muted: false
    }
  ]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickAddFeed: (feed, feeds) => {
      dispatch(addFeed(feed, feeds))
      dispatch(updateFeed(''))
    },
    handleInputChange: (evt) => {
      const feed = evt.target.value
      dispatch(updateFeed(feed))
    }
  }
}

const AddFeed = ({ handleClickAddFeed, handleInputChange, feed, feeds }) => {
  return (
    <Fragment>
      <IconButton title="add new feed" onClick={() => handleClickAddFeed(feed, feeds)} >
        <Add id='addFeed' />
      </IconButton>
      <TextField
        label='enter feed url'
        id='textFieldFeed'
        onChange={handleInputChange}
        value={feed}
        placeholder="https://theintercept.com/feed/?rss"
      />
    </Fragment>
  )
}

AddFeed.propTypes = {
  handleClickAddFeed: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  feed: PropTypes.string.isRequired,
  feeds: PropTypes.array.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(AddFeed)
