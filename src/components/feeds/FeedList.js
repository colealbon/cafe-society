import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import AddFeed from './AddFeed'
import RemoveFeed from './RemoveFeed'
import { removeFeed, toggleFeed } from '../../actions/feedActions'
import { selectFeedSection } from '../../actions/feedSectionActions'
import PublishToBlockstack from '../PublishToBlockstack'

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
    feeds: feeds,
    sections: sections
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickRemoveFeed: (feed) => {
      dispatch(removeFeed(feed))
    },
    handleClickToggleFeed: (feed) => {
      dispatch(toggleFeed(feed))
    },
    handleClickRemoveAllFeeds: (feeds) => {
      feeds.map((feed) => dispatch(removeFeed(feed)))
    },
    handleClickSetFeed: (feed) => {
      dispatch(selectFeedSection(feed))
    }
  }
}

export const FeedList = ({ handleClickSetFeed, handleClickRemoveFeed, handleClickToggleFeed, handleClickRemoveAllFeeds, feeds, sections}) => {
  const deleteSweepFeed = `delete: ${[].concat(feeds).length}`
  return (
    <Fragment>
      <br />
      <br />
      <br />
      <br />
      <List subheader={<ListSubheader><PublishToBlockstack></PublishToBlockstack>Edit/Save Feeds</ListSubheader>} >
        <ListItem key='addItem'>
          <IconButton title={deleteSweepFeed} onClick={() => { handleClickRemoveAllFeeds(feeds) }}>
            <DeleteSweepIcon></DeleteSweepIcon>
          </IconButton>
          <AddFeed />
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
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  id="panel1bh-header"
                >
                <ListItemText primary={feed.url}></ListItemText>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                <Typography>{(!feed.muted) ? 'do not ' : ''}ignore feed</Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                <Typography>apply only to sections:</Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                  {
                    sections.map((section) => {
                      return (<Chip
                        key={section.id}
                        color={(section.id == (feed.sections || [] ).filter((feedSection) => feedSection.id === section.id)
                          .map((feedSection) => feedSection.id)[0]) ? 'primary' : 'default'}
                        label={section.name}
                        onClick={() => handleClickSetFeed(Object.assign(
                          {"section": section},
                          feed
                        ))}
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
