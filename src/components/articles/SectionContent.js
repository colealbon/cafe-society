import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { PlaylistAddCheck, VoiceOverOff, ThumbDown, ThumbUp } from '@material-ui/icons'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { removeArticle, toggleArticle, markArticleRead } from '../../actions/articleActions'
import { learn } from '../../actions/classifierActions'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import {parse} from 'tldjs'
import PropTypes from 'prop-types'
import VerticalSpace from '../VerticalSpace'
import { addFilter, updateFilter} from '../../actions/filterActions'


function getSelectionText() {
  var text = ""
  if (window.getSelection) {
      text = window.getSelection().toString();
  } else if (document.selection && document.selection.type !== "Control") {
      text = document.selection.createRange().text
  }
  return text
}

const mapStateToProps = ({ selectedSection, articles, filters, blockstackUser, classifiers}) => {
  return {
    selectedSection: !!selectedSection ? selectedSection : '',
    classifiers: classifiers,
    articles: !!articles ? articles.filter((article) => [].concat(article.bayesCategories).filter((bayesCategory) => bayesCategory !== undefined && bayesCategory.category === 'notgood').length === 0).filter(article => !article.muted).filter(article => article.visible).filter((article) => (!!article.title)).filter(article => (article.blockReasons || []).length < 1) : [],
    allArticles: !!articles ? articles : [],
    blockstackUser: blockstackUser, 
    filters: !!filters ? filters : [{
      id: 'Car Detailer',
      text: 'Car Detailer',
      feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
      fields: [
        'title',
        {
          id: 'title',
          name: 'title',
          muted: false
        }
      ],
      lastUsed: 1557619427441,
      sections: [
        {
          id: 'classifieds',
          name: 'classifieds'
        }
      ]
    },
    {
      id: 'DoorDash',
      text: 'DoorDash',
      feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
      fields: [
        'title',
        {
          id: 'title',
          name: 'title',
          muted: false
        }
      ],
      lastUsed: 1557619427441,
      sections: [
        {
          id: 'classifieds',
          name: 'classifieds'
        }
      ]
    }]
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
    },
    handleClickAddFilter: (text, filters, selectedSection) => {
      if (text === '') {
        return
      }
      const newFilter = {
        id: text,
        text: text,
        fields: [{id: "title", name: "title", muted: false}],
        sections: [selectedSection]
      }
      dispatch(addFilter(newFilter, filters))
      dispatch(updateFilter(''))
    },
    handleClickLearn: (selectedSection, article, category, classifiers, articles) => {
      dispatch(markArticleRead(article, articles))
      dispatch(learn(category, selectedSection, article, classifiers.filter(classifier => classifier.field === 'title' || classifier.field === 'contentSnippet').filter((classifier) => classifier.section.id === selectedSection.id)))
    }
  }
}

export const SectionPage = ({ handleClickShadowBanDomain, handleClickAddFilter, handleClickRemoveArticle, handleClickMarkAllRead, handleClickToggleArticle, articles, allArticles, selectedSection, filters, classifiers, handleClickLearn}) => {
  const sectionTitle = (selectedSection.id) ? `${selectedSection.id}` : 'home'
  const readTitle = `mark ${articles.length} articles as read`
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

                  <a href={article.link} target="newsfeed-article">{(!!article.title) ? article.title.replace(/&apos;/g, "'").replace(/&amp;/g, "&") : ''}</a>
                </Typography>
                <Typography>{(article.contentSnippet) ? article.contentSnippet.replace(/&apos;/g, "'").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ") : '' }</Typography>
              </CardContent>
              <Typography><IconButton title="train as not-good, add filter from selected text" onClick={() => {
                    if (getSelectionText().length !== 0) {
                      handleClickAddFilter(getSelectionText(), filters, selectedSection)
                    }
                    handleClickLearn(selectedSection, article, 'notgood', classifiers, articles)
                  }}>
                    <ThumbDown id='addFilter'/>
                  </IconButton>
                  <IconButton title="train as good" onClick={() => {
                    handleClickLearn(selectedSection, article, 'good', classifiers, articles)
                  }}>
                    <ThumbUp id='train-good'/>
                  </IconButton>
                  <IconButton title={banDomainTitle} onClick={() => handleClickShadowBanDomain(parse(article.link).domain, selectedSection, filters)} >
                  <VoiceOverOff></VoiceOverOff>
                  </IconButton>
              </Typography>                
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
