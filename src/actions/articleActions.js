import * as blockstack from 'blockstack'
let Parser = require('rss-parser')
let parser = new Parser()
var memoize = require("memoizee")

const slow_fetchFeedContent = feedUrl => {
  return !feedUrl ? 
  Promise.reject('slow_fetchFeedContent requires feed url') :
  parser.parseURL(`/.netlify/functions/node-fetch?url=${feedUrl}`) // cors relay
}

const fetchFeedContent = memoize(slow_fetchFeedContent, { promise: true, maxAge: 10000 })

const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { promise: true, maxAge: 10000 })

export const ARTICLES_REMOVE_ARTICLE = 'ARTICLES_REMOVE_ARTICLE'

export const removeArticle = (removeArticle, articles) => {
  const removeArticles = [].concat(removeArticle)
  return (dispatch) => {
    dispatch({
      type: ARTICLES_REMOVE_ARTICLE,
      payload: removeArticle
    })
    if (!!articles && articles !== undefined) {
      dispatch(publishArticles(articles.filter(articleItem => {
        return removeArticles.filter((removeArticleItem) => (removeArticleItem.id === articleItem.id)).length === 0
      })))
    }
  }
}

export const ARTICLES_MARK_READ = 'ARTICLES_MARK_READ'

export const markArticleRead = (articles, allArticles) => {
  return (dispatch) => {
    dispatch({
      type: ARTICLES_MARK_READ,
      payload: articles
    })
    dispatch(publishArticles(allArticles.map(allArticlesItem => {
      let muteArticle = [].concat(articles).filter((payloadItem) => (payloadItem.id === allArticlesItem.id)).length !== 0
      return (muteArticle === true) ? { ...allArticlesItem, muted: true} : allArticlesItem
    })))
  }
}

export const ARTICLES_TOGGLE_ARTICLE = 'ARTICLES_TOGGLE_ARTICLE'

export const toggleArticle = (articles, allArticles) => {
  return (dispatch) => {
    dispatch({
      type: ARTICLES_TOGGLE_ARTICLE,
      payload: articles
    })
    dispatch(publishArticles(allArticles.map((stateArticle) => {
      let articleMatched = false
      articles = [].concat(articles)
      articles.map((toggleArticle) => {
        if (toggleArticle.id === stateArticle.id) {
          articleMatched = true
        }
        return 'o'
      })
      return (articleMatched === true ) ? { ...stateArticle, muted: !stateArticle.muted || false } : stateArticle
    })))
  }
}

export const FETCH_ARTICLES_START = 'FETCH_ARTICLES_START'
export const FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS'
export const FETCH_ARTICLES_FAIL = 'FETCH_ARTICLES_FAIL'
export const FETCH_SAVED_ARTICLES_SUCCESS = 'FETCH_SAVED_ARTICLES_SUCCESS'
export const FETCH_SAVED_ARTICLES_FAIL = 'FETCH_SAVED_ARTICLES_FAIL'

export const fetchArticles = (feeds, filters) => {
  return (dispatch) => {
    const articlesRequestQueue = []
    articlesRequestQueue.push(
      blockstackGetFile('articles.json')
      .then((savedArticles) => {
        alert(savedArticles)
        if (!JSON.parse(savedArticles)) {
          return
        }
        dispatch({
          type: FETCH_SAVED_ARTICLES_SUCCESS,
          payload: {
            articles: JSON.parse(savedArticles),
            filters: filters
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: FETCH_SAVED_ARTICLES_FAIL,
          payload: error
        })
      })
    )
    feeds.map((feed) => {
      if (feed.muted !== true && feed.url) { 
        dispatch({
          type: FETCH_ARTICLES_START,
          payload: {
            feed: feed,
            filters: filters
          }
        })
        fetchFeedContent(feed.url).then((fetchedContent) => {
          if (!!fetchedContent) {
            if (!!fetchedContent.items) {
              dispatch({
                type: FETCH_ARTICLES_SUCCESS,
                payload: {
                  articles: fetchedContent.items.map((item) => {
                    return !item.guid ? 
                    Object.assign({id: item.link, feed: feed}, item) :
                    Object.assign({id: item.guid, feed: feed}, item)
                  }), 
                  filters: filters
                }
              })
            }
          }
        }).catch((error) => {
          dispatch({
            type: FETCH_ARTICLES_FAIL,
            payload: error
          })
        })
      }
      return 'o'
    })
  }}

export const PUBLISH_ARTICLES_START = 'PUBLISH_ARTICLES_START'
export const PUBLISH_ARTICLES_SUCCESS = 'PUBLISH_ARTICLES_SUCCESS'
export const PUBLISH_ARTICLES_FAIL = 'PUBLISH_ARTICLES_FAIL'

export const publishArticles = (articles) => {
  return (dispatch) => {
    dispatch({
      type: 'PUBLISH_ARTICLES_START',
      payload: articles
    })
    const fileContent = JSON.stringify(articles)
    return blockstack.putFile('articles.json', fileContent)
    .then((response) => {
      dispatch({
        type: 'PUBLISH_ARTICLES_SUCCESS',
        payload: response
      })
    }).catch((error, fileContent) => {
      dispatch({
        type: 'PUBLISH_ARTICLES_FAILED',
        payload: {
          error: error
        }
      })
    })
  }
}