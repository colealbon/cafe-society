import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import AddFeed from './AddFeed'
import RemoveFeed from './RemoveFeed'
import { removeFeed, toggleFeed } from '../../actions/feedActions'
import { selectFeedSection } from '../../actions/feedSectionActions'

import VerticalSpace from '../VerticalSpace'
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import Chip from '@material-ui/core/Chip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Switch from '@material-ui/core/Switch'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const mapStateToProps = ({ feeds, sections }) => {
  return {
    feeds: !!feeds ? feeds :  [{
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
    ],
    sections: !!sections ? sections : [{id: 'headlines', name: 'headlines', muted: false}]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickRemoveFeed: (feed, feeds) => {
      dispatch(removeFeed(feed, feeds))
    },
    handleClickToggleFeed: (feed, feeds) => {
      dispatch(toggleFeed(feed, feeds))
    },
    handleClickRemoveAllFeeds: (feeds) => {
      dispatch(removeFeed(feeds, feeds))
    },
    handleClickSetFeedSection: (feedSection, feeds) => {
      dispatch(selectFeedSection(feedSection, feeds))
    },
  }
}

export const FeedList = ({ handleClickSetFeedSection, handleClickRemoveFeed, handleClickToggleFeed, handleClickRemoveAllFeeds, feeds, sections}) => {
  const deleteSweepFeed = `delete: ${[].concat(feeds).length}`
  return (
    <Fragment>
      <VerticalSpace/>
      <List subheader={<ListSubheader>Edit/Save Feeds</ListSubheader>} >
        <ListItem key='addItem'>
          <IconButton title={deleteSweepFeed} onClick={() => { handleClickRemoveAllFeeds(feeds) }}>
            <DeleteSweepIcon></DeleteSweepIcon>
          </IconButton>
          <AddFeed />
        </ListItem>
        {feeds.filter(feedItem => !!feedItem.url).map((feed) => {
          return (
            <ListItem key={feed.id}>
              <ListItemIcon>
                <RemoveFeed
                  {...feed}
                  onClick={() => {
                    handleClickRemoveFeed(feed, feeds)
                  }}
                />
              </ListItemIcon>
              <span
                onClick={() => {
                  handleClickToggleFeed(feed, feeds)
                }}
                title={feed.muted ? `enable ${feed.url}` : `disable ${feed.url}` }
              >
                <Switch checked={!feed.muted} />
              </span>
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  id="panel1bh-header"
                >
                <ListItemText primary={feed.url}></ListItemText>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                <Typography>{(!feed.muted) ? 'do not ignore feed' : 'ignore feed'}</Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                <Typography>apply only to sections:</Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                  {
                    sections.map((section) => {
                      return (<Chip
                        key={section.id}
                        color={(section.id === (feed.sections || [] ).filter((feedSection) => feedSection.id === section.id)
                          .map((feedSection) => feedSection.id)[0]) ? 'primary' : 'default'}
                        label={section.name}
                        onClick={() => handleClickSetFeedSection(Object.assign(
                          {"section": section},
                          feed
                        ), feeds)}
                      />
                      )
                    })
                  }
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </ListItem>
          )
        }).reverse()
        }
      </List>
    </Fragment>
  )
}

FeedList.propTypes = {
  handleClickSetFeed: PropTypes.func.isRequired,
  handleClickRemoveFeed: PropTypes.func.isRequired,
  handleClickToggleFeed: PropTypes.func.isRequired,
  handleClickRemoveAllFeeds: PropTypes.func.isRequired,
  feeds: PropTypes.array.isRequired,
  sections: PropTypes.array.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedList)
