import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PublishToBlockstack from '../PublishToBlockstack'
import { Check, PlaylistAddCheck, VoiceOverOff } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { removeArticle, toggleArticle } from '../../actions/articleActions'
import { addFilter} from '../../actions/filterActions'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {parse} from 'tldjs';
import Loading from '../Loading'
import PropTypes from 'prop-types'

const mapStateToProps = ({ selectedSection, articles, filters }) => {
  return {
    selectedSection: selectedSection,
    visibleArticles: articles.filter((article) => {
      if ((article.feed || []).length < 1) {
        return false
      }
      let matchedSession = false
      article.feed.sections
      .filter((feedSection) => !feedSection.muted)
      .filter((feedSection) => feedSection.id === selectedSection.id)
      .map(() => matchedSession = true)
      return matchedSession
    }) || [{id: 'noarticles', title: 'no articles', feed: {sections: [`${selectedSection}`]}}],
    filters: filters
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickShadowBanDomain: (link) => {
      dispatch(addFilter({id: parse(link).domain, text: parse(link).domain, fields: [{id:'link',name:'link',muted:false}], muted: false}))
    },
    handleClickRemoveArticle: (article) => {
      dispatch(removeArticle(article))
    },
    handleClickToggleArticle: (article) => {
      dispatch(toggleArticle(article))
    },
    handleClickMarkAllRead: (articles) => {
      articles.map((article) => {
        if (article.muted === false) {
          dispatch(toggleArticle(article))
        }
        return 'o'
      })
    }
  }
}

export const SectionPage = ({ handleClickShadowBanDomain, handleClickRemoveArticle, handleClickMarkAllRead, handleClickToggleArticle, visibleArticles, sections, filters, selectedSection}) => {
  const sectionTitle = (selectedSection.id) ? `${selectedSection.id}` : 'All Sections'


  return (
    <Fragment>
      <br />
      <br />
      <br />
      <br />
      {sectionTitle}
      <p />
      {visibleArticles.map((article) => {
        const banDomainTitle = `add ${parse(article.link).domain} to filters`
        return (
          <Grid item xs={12} key={article.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" >
                  <IconButton title="mark article as read" onClick={() => handleClickToggleArticle(article)}>
                    <Check
                      id='checkToggleArticle'
                      style={{ color: 'green' }}
                    />
                  </IconButton>
                  <a href={article.link} target="newsfeed-demo-article">{article.title}</a>
                  <IconButton title={banDomainTitle} onClick={() => handleClickShadowBanDomain(parse(article.link).domain)} >
                  <VoiceOverOff></VoiceOverOff>
                  </IconButton>
                </Typography>

                <br/>
                <Typography>{article.contentSnippet}</Typography>
                <p/>
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Fragment>
  )
}

SectionPage.propTypes = {
  selectedSection: PropTypes.object.isRequired,
  visibleArticles: PropTypes.array.isRequired,
  filters: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionPage)
