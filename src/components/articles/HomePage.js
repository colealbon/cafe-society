import React, { Fragment } from "react";
import { connect } from 'react-redux'
import PublishToBlockstack from '../PublishToBlockstack'
import { Check, PlaylistAddCheck, VoiceOverOff, DeleteSweep } from '@material-ui/icons';
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

const mapStateToProps = ({ articles, filters }) => {
  return {
    articles: articles,
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
    },
    handleClickRemoveAllArticles: (articles) => {
      articles.map((article) => dispatch(removeArticle(article)))
    },
  }
}

export const HomePage = ({ handleClickShadowBanDomain, handleClickRemoveArticle, handleClickRemoveAllArticles, handleClickMarkAllRead, handleClickToggleArticle, articles, sections, filters, ...rest}) => {
  const readTitle = `mark ${articles.filter((article) => article.muted === false).length} articles as read`
  const deleteSweepTitle = `delete: ${articles.length}`
  return (
    <Fragment><br/><br/><br/><br/>
      <PublishToBlockstack />
      <IconButton title={deleteSweepTitle} onClick={() => {handleClickRemoveAllArticles(articles)}}>
        <DeleteSweep></DeleteSweep>
      </IconButton>
      <IconButton title={readTitle} onClick={() => {handleClickMarkAllRead(articles)}} >
        <PlaylistAddCheck></PlaylistAddCheck>
      </IconButton>
      {(articles.filter((article) => {
        // MOVE THIS SECTION TO ARTICLES REDUCER - COLE ALBON
        let matchedFilter = false
        filters.filter((filter) => !filter.muted).map((filter) => {
          if ( matchedFilter === true ) {
            return 'o'
          }
          (filter.fields || []).map((field) => {
            if ( matchedFilter === true ) {
              return 'o'
            }
            if (article[field.name] === undefined) {
              return 'o'
            }
            if (article[field.name].indexOf(filter.text) !== -1) {
                matchedFilter = true
            }
            return 'o'
          })
          return 'o'
        })
        return !matchedFilter
      }) || []).filter((article) => !article.muted).length} unread
      <Loading />
      <Grid >
        {(articles.filter((article) => {
          // MOVE THIS SECTION TO ARTICLES REDUCER - COLE ALBON
          let matchedFilter = false
          filters.filter((filter) => !filter.muted).map((filter) => {
            if ( matchedFilter === true ) {
              return 'o'
            }
            (filter.fields || []).map((field) => {
              if ( matchedFilter === true ) {
                return 'o'
              }
              if (article[field.name] === undefined) {
                return 'o'
              }
              if (article[field.name].indexOf(filter.text) !== -1) {
                  matchedFilter = true
              }
              return 'o'
            })
            return 'o'
          })
          return !matchedFilter
        }) || []).filter((article) => !article.muted).map((article) => {
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
      </Grid>
    </Fragment>
  )
}
HomePage.propTypes = {
  articles: PropTypes.array.isRequired,
  filters: PropTypes.array.isRequired
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
