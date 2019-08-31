import * as blockstack from 'blockstack'
import uuid from 'uuidv4'
let Parser = require('rss-parser')
let parser = new Parser()
var memoize = require("memoizee")
var hash = require('object-hash')

export const FETCH_ARTICLES_START = 'FETCH_ARTICLES_START'
export const FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS'
export const FETCH_ARTICLES_FAIL = 'FETCH_ARTICLES_FAIL'
export const FETCH_SAVED_ARTICLES_SUCCESS = 'FETCH_SAVED_ARTICLES_SUCCESS'
export const FETCH_SAVED_ARTICLE_SUCCESS = 'FETCH_SAVED_ARTICLE_SUCCESS'
export const FETCH_SAVED_ARTICLES_FAIL = 'FETCH_SAVED_ARTICLES_FAIL'

const slow_fetchFeedContent = feedUrl => {
  return !feedUrl ? 
  Promise.reject('slow_fetchFeedContent requires feed url') :
  parser.parseURL(feedUrl)
  .catch(() => parser.parseURL(`/.netlify/functions/node-fetch?url=${feedUrl}`)) // cors relay
}

const fetchFeedContent = memoize(slow_fetchFeedContent, { promise: true, maxAge: 10000})

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
    dispatch(publishArticles(allArticles.map((stateArticle) => {
      let articleMatched = false
      articles = [].concat(articles)
      articles.map((toggleArticle) => {
        if (toggleArticle.id === stateArticle.id) {
          articleMatched = true
        }
        return 'o'
      })
      return (articleMatched === true ) ? { ...stateArticle, muted: true || false } : stateArticle
    }), gaiaLinks ))
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

export const fetchArticles = (feeds, filters, gaiaLinks) => {
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
        fetchFeedContent(feed.url)
        .then((fetchedContent) => {
          if (!fetchedContent.items) {
            return
          }
          dispatch({
            type: FETCH_ARTICLES_SUCCESS,
            payload: fetchedContent.items.map((item) => {
              const salt = uuid()
              return Object.assign({articleId: hash.sha1(item.link, salt), feed: feed, salt: salt}, item)
            }) 
            .filter((articleItem) => articleItem.title !== '')
            .map(articleItem => {
              if (!gaiaLinks) {
                return articleItem
              }
              return {
                muted: gaiaLinks
                .filter(gaiaLinkItem => articleItem.articleId === gaiaLinkItem.articleId)
                .filter(gaiaLinkItem => gaiaLinkItem.muted)[0] 
                || articleItem.muted || false,
                ...articleItem
              }
            })
            .map(articleItem => {
              try {
                const blockReasons = filters
                .filter((filterItem) => !filterItem.muted )
                .filter((filterItem) => {
                  return (filterItem.sections === undefined || filterItem.sections.length === 0) ?
                  true :
                  filterItem.sections.filter((filterItemSectionItem) => {
                    if (articleItem.feed.sections === undefined) {
                      return false
                    }
                    return articleItem.feed.sections.filter((articleItemSectionItem) => articleItemSectionItem.id === filterItemSectionItem.id).length !== 0
                  }).length !==0
                })
                .filter(filterItem => {
                  return (filterItem.fields === undefined || filterItem.fields.length === 0) ?
                  Object.keys(articleItem)
                  .filter((articleField) => articleField !== 'id')
                  .filter((articleField) => articleField !== 'feed')
                  .filter((articleField) => articleField !== 'isoDate')
                  .filter((articleField) => articleField !== 'guid')
                  .filter((articleField) => articleField !== 'muted')
                  .filter((articleField) => articleField !== 'pubDate')
                  .filter((articleField) => {
                    return articleItem[`${articleField}`].indexOf(filterItem.text) !== -1
                  }).length !== 0 :
                  filterItem.fields.filter(filterItemFieldItem => filterItemFieldItem.name !== undefined).filter((filterItemFieldItem) => {
                    return articleItem[`${filterItemFieldItem.name}`].indexOf(filterItem.text) !== -1
                  }).length !== 0
                })
                return (blockReasons.length === 0) ? articleItem : Object.assign( articleItem, {blockReasons: blockReasons, muted: true})
              } catch (error) {
                dispatch({
                  type: 'FETCH_ARTICLES_FAIL',
                  payload: error
                })
              }
              return 'o'
            })
          })
        }).catch((error) => {
          dispatch({
            type: FETCH_ARTICLES_FAIL,
            payload: error
          })
        })
      }
      return  'o'
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
      blockstack.getFileUrl(filename)
      .then(fileUrl => blockstackGetFile(filename)
        .then((fileContents) => {
          if (JSON.parse(fileContents) !== null) {
            dispatch({
              type: FETCH_SAVED_ARTICLE_SUCCESS,
              payload: JSON.parse(fileContents)
            })
            dispatch({
              type: 'FETCH_SAVED_GAIA_LINK_SUCCESS',
              payload: {
                gaiaUrl: fileUrl,
                sha1Hash: filename,
                articleId: JSON.parse(fileContents).id
              }
            })
          }
        })
      )
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
      articles = !Array.isArray(articles) ? [articles] : articles
      articles.filter((articleItem) => !!articleItem).map((articleItem) => {
        const sha1Hash = hash.sha1(articleItem)
        // if article changed (ex. mark as read), delete its gaia file
        if (!!gaiaLinks) {
          return gaiaLinks.filter((gaiaLink) => gaiaLink.articleId === articleItem.articleId)
          .filter((gaiaLink) => (gaiaLink.sha1Hash !== sha1Hash))
          .map(gaiaLink => {
            if (!gaiaLink) {
              return 'o'
            }
            dispatch({
              type: 'DELETE_GAIA_LINK_START',
              payload: gaiaLink
            })
           // if cors errors persist for DELETE, publish empty file here.
            blockstack.deleteFile(`${gaiaLink.sha1Hash}`)
            .then(() => dispatch({
              type: 'DELETE_GAIA_LINK_SUCCESS'
            }))
            .catch((error) => {
              dispatch({
                type: 'DELETE_GAIA_LINK_FAIL',
                payload: error
              })
            })
            return 'o'
          })
        }

        if ([].concat(gaiaLinks).filter((gaiaLink) => gaiaLink !== undefined)
        .filter((gaiaLink) => gaiaLink.articleId === articleItem.articleId)
        .filter((gaiaLink) => gaiaLink.sha1Hash === sha1Hash)
        .length === 0) {
          dispatch({
            type: 'PUBLISH_ARTICLE_START',
            payload: {
              sha1Hash: sha1Hash,
              articleId: articleItem.cafeSicietyId
            }
          })
          blockstackPutFile( articleItem.articleId, JSON.stringify(articleItem))
          .then((gaiaUrl) => {
            const theDate = Date.now()
            dispatch({
              type: 'PUBLISH_ARTICLE_SUCCESS',
              payload: {
                gaiaUrl: gaiaUrl,
                articleId: articleItem.articleId,
                muted: articleItem.muted,
                salt: articleItem.salt,
                date: theDate
              }
            })
            blockstackPutFile('gaiaLinks', 
              [].concat(gaiaLinks.filter((gaiaLinkItem) => gaiaLinkItem.articleId !== articleItem.articleId)).concat({
                gaiaUrl: gaiaUrl,
                articleId: articleItem.articleId,
                muted: articleItem.muted,
                salt: articleItem.salt,
                date: theDate
              })
            )
          }).catch((error) => {
            dispatch({
              type: 'PUBLISH_ARTICLE_FAIL',
              payload: sha1Hash
            })
          })
        } else {
          dispatch({
            type: 'DUPLICATE_NO_PUBLISH',
            payload: articles
          })
        }

        return 'o'
      })
    })
  }
}