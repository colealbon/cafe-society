import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Check, PlaylistAddCheck, VoiceOverOff } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { removeArticle, toggleArticle, markArticleRead } from '../../actions/articleActions'
import { addFilter} from '../../actions/filterActions'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {parse} from 'tldjs';
import PropTypes from 'prop-types'
import VerticalSpace from '../VerticalSpace'

const mapStateToProps = ({ selectedSection, articles, filters }) => {
  return {
    selectedSection: selectedSection,
    articles: articles.filter(article => !article.muted).filter(article => article.visible).filter((article) => (!!article.title)).filter(article => (article.blockReasons || []).length < 1),
    allArticles: articles,
    filters: filters
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickShadowBanDomain: (link, selectedSection, filters) => {
      dispatch(addFilter({id: parse(link).domain, text: parse(link).domain, fields: [{id:'link',name:'link',muted:false}], sections: [selectedSection], muted: false, }, filters))
    },
    handleClickRemoveArticle: (article, articles) => {
      dispatch(removeArticle(article, articles))
    },
    handleClickToggleArticle: (article, articles) => {
      dispatch(toggleArticle(article, articles))
    },
    handleClickMarkAllRead: (articles) => {
      dispatch(markArticleRead(articles, articles))
    }
  }
}

export const SectionPage = ({ handleClickShadowBanDomain, handleClickRemoveArticle, handleClickMarkAllRead, handleClickToggleArticle, articles, allArticles, selectedSection, filters}) => {
  const sectionTitle = (selectedSection.id) ? `${selectedSection.id}` : 'home'
  const readTitle = `mark ${articles.filter((article) => article.muted === false).length} articles as read`
  return (
    <Fragment>
      <VerticalSpace/>
      <Typography variant="h4" >
        <IconButton title={readTitle} onClick={() => {handleClickMarkAllRead(articles, allArticles)}} >
          <PlaylistAddCheck></PlaylistAddCheck>
        </IconButton>
        {sectionTitle}
      </Typography>
      <p />
      {articles
        .map((article) => {
        const banDomainTitle = `add ${parse(article.link).domain} to filters`
        return (
          <Grid item xs={12} key={article.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" >
                  <IconButton title="mark article as read" onClick={() => handleClickToggleArticle(article, articles)}>
                    <Check
                      id='checkToggleArticle'
                      style={{ color: 'green' }}
                    />
                  </IconButton>
                  <a href={article.link} target="newsfeed-demo-article">{(!!article.title) ? article.title.replace(/&apos;/g, "\'").replace(/&amp;/g, "&") : ''}</a>
                  <IconButton title={banDomainTitle} onClick={() => handleClickShadowBanDomain(parse(article.link).domain, selectedSection, filters)} >
                  <VoiceOverOff></VoiceOverOff>
                  </IconButton>
                </Typography>
                <br/>
                <Typography>{(article.contentSnippet) ? article.contentSnippet.replace(/&apos;/g, "\'").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ") : '' }</Typography>
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
  articles: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionPage)
