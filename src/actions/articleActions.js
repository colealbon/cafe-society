let Parser = require('rss-parser')
let parser = new Parser()
var memoize = require("memoizee")
import * as blockstack from 'blockstack'

const FETCH_FEED_CONTENT_FAILED = 'FETCH_FEED_CONTENT_FAILED'

const slow_fetchFeedContent = feedUrl => {
  return new Promise((resolve, reject) => {
    parser.parseURL(feedUrl)
    .then((parsedContent) => resolve(parsedContent))
    .catch(() => {
      parser.parseURL(`https://cors.io/?${feedUrl}`)
      .then((parsedContent) => resolve(parsedContent))
      .catch(() => {
        parser.parseURL(`https://cors-anywhere.herokuapp.com/${feedUrl}`)
        .then((parsedContent) => resolve(parsedContent))
        .catch((error) => reject(error))
      })
    })
  })
}

const fetchFeedContent = memoize(slow_fetchFeedContent, { promise: true, maxAge: 600 * 1000  })

export const ARTICLES_REMOVE_ARTICLE = 'ARTICLES_REMOVE_ARTICLE'

export const removeArticle = article => {
  return (dispatch) => {
    dispatch({
      type: ARTICLES_REMOVE_ARTICLE,
      payload: article
    })
  }
}

export const ARTICLES_TOGGLE_ARTICLE = 'ARTICLES_TOGGLE_ARTICLE'

export const toggleArticle = (articles, allArticles) => {
  return (dispatch) => {
    dispatch({
      type: ARTICLES_TOGGLE_ARTICLE,
      payload: articles
    })
    const newArticles = allArticles.map((stateArticle) => {
      let articleMatched = false
      articles = [].concat(articles)
      const newArticles = articles.map((toggleArticle) => {
        if (toggleArticle.id === stateArticle) {
          articleMatched = true
        }
      })
      return (articleMatched === true ) ? { ...stateArticle, muted: !stateArticle.muted || false } : stateArticle
    })
    dispatch(publishArticles(newArticles))
  }
}

export const FETCH_ARTICLES_START = 'FETCH_ARTICLES_START'
export const FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS'
export const FETCH_SAVED_ARTICLES_SUCCESS = 'FETCH_SAVED_ARTICLES_SUCCESS'
export const FETCH_SAVED_ARTICLES_FAIL = 'FETCH_ARTICLES_FAIL'

export const fetchArticles = (feeds, filters) => {
  filters = [].concat(filters)
  feeds = [].concat(feeds.filter((feedItem) => feedItem !== null))
  return (dispatch) => {
    const articlesRequestQueue = []
    articlesRequestQueue.push(new Promise((resolve, reject) => {
      blockstack.getFile('articles.json', {
        decrypt: false
      })
      .then((fileContents) => {
        dispatch({
          type: FETCH_SAVED_ARTICLES_SUCCESS,
          payload: {articles: JSON.parse(fileContents)}
        })
        resolve(JSON.parse(fileContents))
      })
      .catch((error) =>{
        dispatch({
          type: FETCH_SAVED_ARTICLES_FAIL,
          payload: {error: error}
        })
      })
   }))

    feeds.map((feed) => {
      if (feed.muted !== true) { 
        dispatch({
          type: FETCH_ARTICLES_START,
          payload: {
            feed: feed,
            filters: filters
          }
        })
        articlesRequestQueue.push(
          new Promise((resolve, reject) => {
            fetchFeedContent(feed.url)
            .then((feedContent) => {
              if (!!feedContent ) {
                if (!!feedContent.items) {
                  const articles = feedContent.items.map((item) => Object.assign({id: item.link, feed: feed, muted: false}, item ))
                  dispatch({
                    type: FETCH_ARTICLES_SUCCESS,
                    payload: {articles: articles, filters: filters}
                  })
                  resolve()   
                }
                reject({message: feedUrl})
              }
              reject({message: feedUrl})
            })
            .catch((error) => {
              dispatch({
                type: 'FETCH_ARTICLES_FAILED',
                payload: {
                  error: error
                }
              })
            })
          })
        )
      }
    })
  }
}

export const PUBLISH_ARTICLES_START = 'PUBLISH_ARTICLES_START'
export const PUBLISH_ARTICLES_SUCCESS = 'PUBLISH_ARTICLES_SUCCESS'
export const PUBLISH_ARTICLES_FAIL = 'PUBLISH_ARTICLES_FAIL'

export const publishArticles = (articles) => {
  return (dispatch) => {
    dispatch({
      type: 'PUBLISH_ARTICLES_REQUEST',
      payload: articles
    })
    const fileContent = JSON.stringify(articles)
    return blockstack.putFile('articles.json', fileContent, {encrypt: false})
    .then((response) => {
      dispatch({
        type: PUBLISH_ARTICLES_SUCCESS,
        payload: {
          response: response
        }
      })
    }).catch((error) => {
      dispatch({
        type: 'PUBLISH_ARTICLES_FAILED',
        payload: {
          error: error
        }
      })
    })
  }
}