import React, { Fragment } from "react"
import { connect } from 'react-redux'
import PublishToBlockstack from '../PublishToBlockstack'
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import Typography from '@material-ui/core/Typography'
import { removeArticle, toggleArticle } from '../../actions/articleActions'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Loading from '../Loading'

const mapStateToProps = ({ articles, filters}) => {
  return {
    articles: articles,
    filters: filters
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickRemoveArticle: (article) => {
      dispatch(removeArticle(article))
    },
    handleClickToggleArticle: (article) => {
      dispatch(toggleArticle(article))
    }
  }
}

export const ArticleList = ({ handleClickToggleArticle, publishArticles, articles, filters }) => {
  const deleteSweepTitle = `delete: ${articles.length}`
  return (
    <Fragment>
      <PublishToBlockstack />
      <IconButton title={deleteSweepTitle} onClick={() => {handleClickRemoveAllArticles(articles)}}>
        <DeleteSweepIcon></DeleteSweepIcon>
      </IconButton>
      <Loading />
      <Grid>
      {articles.map((article) => {
        // filters.map((filter) => {
        //   filter.fields.map((field) => {
        //     if (article[field].indexOf(filter.text) !== -1) {
        //       if ((filter.feedUrl || article.feedUrl) === article.feedUrl) {
        //         article.surpressReason = article.surpressReason || filter
        //       }
        //       return 'o'
        //     }
        //     return 'o'
        //   })
        //   return 'o'
        // })
        return (
          <Grid key={article.link}>
            <Card>
              <CardContent>
                <Typography>
                <span
                  style={{ textDecoration: article.muted ? 'line-through' : 'none' }}
                  onClick={() => {
                    handleClickToggleArticle(article)
                  }}
                >
                {article.link}
                </span>
                </Typography>
                <Typography>{article.title}</Typography>
                <Typography>surpress reason: {JSON.stringify(article.surpressReason) || '?'}</Typography>
                {article.surpressReason ? JSON.stringify(article.surpressReason) : ''}
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  </Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);
