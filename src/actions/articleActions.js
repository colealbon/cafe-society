import * as blockstack from 'blockstack'
let Parser = require('rss-parser')
let parser = new Parser()
var memoize = require("memoizee")


export const FETCH_FEED_CONTENT_START = 'FETCH_FEED_CONTENT_START'
export const FETCH_FEED_CONTENT_SUCCESS = 'FETCH_FEED_CONTENT_SUCCESS'
export const FETCH_FEED_CONTENT_FAIL = 'FETCH_FEED_CONTENT_FAIL'

export const FETCH_SAVED_ARTICLES_FAIL = 'FETCH_SAVED_ARTICLES_FAIL'

export const FETCH_SAVED_ARTICLE_SUCCESS = 'FETCH_SAVED_ARTICLE_SUCCESS'
export const FETCH_SAVED_ARTICLE_FAIL = 'FETCH_SAVED_ARTICLE_FAIL'

const slow_fetchFeedContent = feedUrl => {
  return !feedUrl ? 
  Promise.reject('slow_fetchFeedContent requires feed url') :
  parser.parseURL(feedUrl)
  .catch(() => parser.parseURL(`/.netlify/functions/node-fetch?url=${feedUrl}`)) // cors relay
}

const fetchFeedContent = memoize(slow_fetchFeedContent, { promise: true, maxAge: 10000})

export const ARTICLES_REMOVE_ARTICLE = 'ARTICLES_REMOVE_ARTICLE'
export const MANIFESTS_REMOVE_MANIFEST = 'MANIFESTS_REMOVE_MANIFEST'

export const removeArticle = (article) => {
  const articles = [].concat(article)
  return (dispatch) => {
    dispatch({
      type: ARTICLES_REMOVE_ARTICLE,
      payload: articles
    })
    // dispatch({
    //   type: MANIFESTS_REMOVE_MANIFEST,
    //   payload: articles
    // })
  }
}

export const ARTICLES_MARK_READ = 'ARTICLES_MARK_READ'
export const PUBLISH_MANIFESTS_START = 'PUBLISH_MANIFESTS_START'
export const PUBLISH_MANIFESTS_SUCCESS = 'PUBLISH_MANIFESTS_SUCCESS'
export const PUBLISH_MANIFESTS_ERROR = 'PUBLISH_MANIFESTS_ERROR'

export const markArticleRead = (articles, manifests, blockstackUser) => {
  return (dispatch) => {
    dispatch({
      type: ARTICLES_MARK_READ,
      payload: articles
    })
    if (!blockstackUser.isAuthenticated) {
      return
    }
    dispatch(() => {
      try {
        const newManifests = manifests
        .filter(manifest => !manifest.gaiaUrl)
        .filter(manifestItem => {
          return [].concat(articles).filter(articleItem => {
            return articleItem.link === manifestItem.link
          }).length === 0
        })
        .concat([].concat(articles).map(articleItem => {
          return {
            link: articleItem.link,
            muted: true,
            feed: articleItem.feed
          }
        }))
        dispatch({
          type: PUBLISH_MANIFESTS_START,
          payload: newManifests
        })
        const fileContent = JSON.stringify(newManifests)
        blockstack.putFile('manifests.json', fileContent)
        .then((response) => {
          dispatch({
            type: PUBLISH_MANIFESTS_SUCCESS,
            payload: {
              response: response,
              manifests: newManifests
            }
          })
        })
        .catch((error) => {
          dispatch({
            type: PUBLISH_MANIFESTS_ERROR,
            payload: {
              error: error
            }
          })
        })
      } catch (error) {
      dispatch({
        type: PUBLISH_MANIFESTS_ERROR,
        payload: {
          error: error
        }
      })
    }
  })
  }
}

export const ARTICLES_TOGGLE_ARTICLE = 'ARTICLES_TOGGLE_ARTICLE'

export const toggleArticle = (articles, allArticles, manifests) => {
  return (dispatch) => {
    dispatch({
      type: ARTICLES_TOGGLE_ARTICLE,
      payload: articles
    })
  }
}

export const fetchArticles = (feeds, filters, manifests) => {
  return (dispatch) => {
    feeds.map((feed) => {
      if (feed.muted !== true && feed.url) { 
        dispatch({
          type: FETCH_FEED_CONTENT_START,
          payload: {
            feed: feed,
            filters: filters
          }
        })
        dispatch(() => {
          fetchFeedContent(feed.url)
          .then((fetchedContent) => {
            dispatch({
              type: 'FETCH_FEED_CONTENT_FETCHED',
              payload: {
                feed: feed,
                filters: filters,
                manifests: manifests,
                fetchedContent: fetchedContent    
              }  
            })
            if ([].concat(fetchedContent.items).length === 0) {
              dispatch({
                type: 'FETCH_FEED_CONTENT_FAIL_EMPTY_RESPONSE',
                payload: fetchedContent
              })
              return
            }
            dispatch({
              type: FETCH_FEED_CONTENT_SUCCESS,
              payload: {
                feed: feed,
                filters: filters,
                manifests: manifests,
                fetchedContent: fetchedContent    
              }             
            })
            return
          }).catch((error) => {
            dispatch({
              type: FETCH_FEED_CONTENT_FAIL,
              payload: error
            })
          })
        })
      }
      return 'o'
    })
  }
}