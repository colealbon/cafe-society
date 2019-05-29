import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import AddFeed from './AddFeed'
import RemoveFeed from './RemoveFeed'
import { removeFeed, toggleFeed } from '../../actions/feedActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'

import Loading from '../Loading'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Switch from '@material-ui/core/Switch'

const mapStateToProps = ({ feeds, sections }) => {
  return {
    feeds: feeds,
    sections: sections
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleClickRemoveFeed: (feed) => {
      dispatch(removeFeed(feed))
    },
    handleClickToggleFeed: (feed) => {
      dispatch(toggleFeed(feed))
    },
    handleClickRemoveAllFeeds: (feeds) => {
      feeds.map((feed) => dispatch(removeFeed(feed)))
    }
  }
}

export const FeedList = ({ handleClickRemoveFeed, handleClickToggleFeed, handleClickRemoveAllFeeds, publishFeeds, feeds, sections, ...rest}) => {
  const deleteSweepFeed = `delete: ${[].concat(feeds).length}`
  return (
    <Fragment>
      <br />
      <br />
      <br />
      <br />
      <List subheader={<ListSubheader>Edit Feeds</ListSubheader>} >
        <ListItem key='addItem'>
          <IconButton title={deleteSweepFeed} onClick={() => { handleClickRemoveAllFeeds(feeds) }}>
            <DeleteSweepIcon></DeleteSweepIcon>
          </IconButton>
          <AddFeed />
          <Loading />
        </ListItem>
        {feeds.map((feed) => {
          return (
            <ListItem key={feed.id}>
              <ListItemIcon>
                <RemoveFeed
                  {...feed}
                  onClick={() => {
                    handleClickRemoveFeed(feed)
                  }}
                />
              </ListItemIcon>
              <span
                onClick={() => {
                  handleClickToggleFeed(feed)
                }}
                title={feed.muted ? `enable ${feed.url}` : `disable ${feed.url}` }
              >
                <Switch checked={!feed.muted} />
              </span>
              <ListItemText primary={feed.url}></ListItemText>
              {sections.map((section) => {
                return (
                  <span key={section.id}>{section.name}&nbsp;</span>
                )
              })}
            </ListItem>
          )
        }).reverse()
        }
      </List>
    </Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedList)
