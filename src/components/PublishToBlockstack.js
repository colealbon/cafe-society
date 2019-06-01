import React from 'react'
import { connect } from 'react-redux'
import { Save } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types'

// import { publishArticles } from '../actions/articleActions'
import { publishContacts } from '../actions/contactActions'
import { publishFeeds } from '../actions/feedActions'
// import { publishFilters } from '../actions/filterActions'

const mapStateToProps = ({ contacts, feeds }) => {

  //articles, surpressLinks, surpressTitles, feeds, filters}) => {
  return {
    contacts: contacts,
    // articles: articles,
    // surpressLinks: surpressLinks,
    // surpressTitles: surpressTitles,
    // friends: friends,
    feeds: feeds
    // filters: filters
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handlePublishToBlockstack: ( contacts, feeds ) => {
      //articles, surpressLinks, surpressTitles, friends, feeds, filters) => {
      //dispatch(publishArticles(articles))
      dispatch(publishContacts(contacts))
      dispatch(publishFeeds(feeds))
      //dispatch(publishFilters(filters, articles))
    }
  }
}

const PublishToBlockstack = ({ contacts, feeds, handlePublishToBlockstack}) => {
  // articles, surpressLinks, surpressTitles, friends, feeds, filters, handlePublishToBlockstack}) => {
  return (
    <IconButton title="publish to blockstack" onClick={() => handlePublishToBlockstack( contacts, feeds )}>
      <Save></Save>
    </IconButton>
  )
}

PublishToBlockstack.propTypes = {
  contacts: PropTypes.array.isRequired,
  feeds:  PropTypes.array.isRequired,
  handlePublishToBlockstack: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(PublishToBlockstack)
