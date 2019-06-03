import React from 'react'
import { connect } from 'react-redux'
import { Save } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types'

import { publishArticles } from '../actions/articleActions'
import { publishContacts } from '../actions/contactActions'
import { publishFeeds } from '../actions/feedActions'
import { publishFilters } from '../actions/filterActions'
import { publishSections } from '../actions/sectionActions'

const mapStateToProps = ({ contacts, feeds, filters, articles, sections }) => {

  return {
    contacts: contacts,
    articles: articles,
    feeds: feeds,
    filters: filters,
    sections: sections
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handlePublishToBlockstack: ( contacts, feeds, filters, articles, sections ) => {
      dispatch(publishContacts(contacts))
      dispatch(publishFeeds(feeds))
      dispatch(publishFilters(filters))
      dispatch(publishArticles(articles))
      dispatch(publishSections(sections))
    }
  }
}

const PublishToBlockstack = ({ contacts, feeds, filters, articles, sections, handlePublishToBlockstack}) => {
  return (
    <IconButton title="publish to blockstack" onClick={() => handlePublishToBlockstack( contacts, feeds, filters, articles, sections )}>
      <Save></Save>
    </IconButton>
  )
}

PublishToBlockstack.propTypes = {
  contacts: PropTypes.array.isRequired,
  feeds:  PropTypes.array.isRequired,
  filters:  PropTypes.array.isRequired,
  articles: PropTypes.array.isRequired,
  sections: PropTypes.array.isRequired,
  handlePublishToBlockstack: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(PublishToBlockstack)
