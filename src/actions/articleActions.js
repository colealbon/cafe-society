import * as blockstack from 'blockstack'
let Parser = require('rss-parser')
let parser = new Parser()
var memoize = require("memoizee")
var hash = require('object-hash');

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

export const removeArticle = (removeArticle, articles, gaiaLinks) => {
  const removeArticles = [].concat(removeArticle)
  return (dispatch) => {
    dispatch({
      type: ARTICLES_REMOVE_ARTICLE,
      payload: removeArticle
    })
    if (!!articles && articles !== undefined) {
      dispatch(publishArticles(articles.filter(articleItem => {
        return removeArticles.filter((removeArticleItem) => (removeArticleItem.id === articleItem.id)).length === 0
      }), gaiaLinks))
    }
  }
}

export const ARTICLES_MARK_READ = 'ARTICLES_MARK_READ'

const slowBlockstackPutFile = (filename, options) => {
  return blockstack.putFile(filename, options)
}
const blockstackPutFile = memoize(slowBlockstackPutFile, { promise: true })

export const markArticleRead = (articles, allArticles, gaiaLinks) => {
  return (dispatch) => {
    dispatch({
      type: ARTICLES_MARK_READ,
      payload: articles
    })
    dispatch(publishArticles(allArticles.map(allArticlesItem => {
      let muteArticle = [].concat(articles).filter((payloadItem) => (payloadItem.id === allArticlesItem.id)).length !== 0
      return (muteArticle === true) ? { ...allArticlesItem, muted: true} : allArticlesItem
    }), gaiaLinks))
  }
}

export const ARTICLES_TOGGLE_ARTICLE = 'ARTICLES_TOGGLE_ARTICLE'

export const toggleArticle = (articles, allArticles, gaiaLinks) => {
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
    }), gaiaLinks ))
  }
}

export const FETCH_ARTICLES_START = 'FETCH_ARTICLES_START'
export const FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS'
export const FETCH_ARTICLES_FAIL = 'FETCH_ARTICLES_FAIL'
export const FETCH_SAVED_ARTICLES_SUCCESS = 'FETCH_SAVED_ARTICLES_SUCCESS'
export const FETCH_SAVED_ARTICLE_SUCCESS = 'FETCH_SAVED_ARTICLE_SUCCESS'
export const FETCH_SAVED_ARTICLES_FAIL = 'FETCH_SAVED_ARTICLES_FAIL'

export const fetchArticles = (feeds, filters) => {
  return (dispatch) => {
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
                  feed: feed,
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
  }
}

export const fetchBlockstackArticles = (articles) => {
  return (dispatch) => {
    dispatch({ 
      type: 'FETCH_BLOCKSTACK_ARTICLES_START',
      payload: articles
    })

    blockstack.listFiles((filename) => {
      dispatch({ 
        type: 'FETCH_BLOCKSTACK_ARTICLE_START',
        payload: filename
      })
      if (filename.indexOf('.json') !== -1) {
        return
      }
      blockstackGetFile(filename)
      .then((fileContents) => {
        if (JSON.parse(fileContents) !== null) {
          dispatch({
            type: FETCH_SAVED_ARTICLE_SUCCESS,
            payload: JSON.parse(fileContents)
          })
        }
      })
      return true
    })
    .catch((error) =>{
      dispatch({
        type: FETCH_SAVED_ARTICLES_FAIL,
        payload: error
      })
    })
  }
}

export const PUBLISH_ARTICLES_START = 'PUBLISH_ARTICLES_START'
export const PUBLISH_ARTICLE_SUCCESS = 'PUBLISH_ARTICLE_SUCCESS'
export const PUBLISH_ARTICLES_FAIL = 'PUBLISH_ARTICLES_FAIL'

export const publishArticles = (articles, gaiaLinks) => {
  return (dispatch) => {
    dispatch({
      type: 'PUBLISH_ARTICLES_START',
      payload: articles
    })
    dispatch(() => {
      articles.map((articleItem) => {
        const sha1Hash = hash(articleItem)
        dispatch({
          type: 'PUBLISH_ARTICLE_START',
          payload: {
            sha1Hash: sha1Hash,
            articleId: articleItem.id
          }
        })

        gaiaLinks.filter((gaiaLink) => gaiaLink.articleId === articleItem.id)
          .filter((gaiaLink) => (gaiaLink.sha1Hash !== sha1Hash))
          .map(gaiaLink => dispatch(blockstack.deleteFile(gaiaLink.sha1Hash)))

        if (gaiaLinks
          .filter((gaiaLink) => gaiaLink.articleId === articleItem.id)
          .filter((gaiaLink) => gaiaLink.sha1Hash === sha1Hash)
          .length !== 0) {
          return
        }
        return blockstackPutFile(sha1Hash, JSON.stringify(articleItem))
        .then((gaiaUrl) => {
          dispatch({
            type: 'PUBLISH_ARTICLE_SUCCESS',
            payload: {
              gaiaUrl: gaiaUrl,
              sha1Hash: sha1Hash,
              articleId: articleItem.id
            }
          })
        }).catch((error) => {
          //pass
        })
      })
    })
  }
}