import * as blockstack from 'blockstack'
import uuid from 'uuidv4'
let Parser = require('rss-parser')
let parser = new Parser()
var memoize = require("memoizee")
var hash = require('object-hash')

export const FETCH_ARTICLES_START = 'FETCH_ARTICLES_START'
export const FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS'
export const FETCH_ARTICLES_FAIL = 'FETCH_ARTICLES_FAIL'

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

const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { promise: true, maxAge: 10000 })

export const ARTICLES_REMOVE_ARTICLE = 'ARTICLES_REMOVE_ARTICLE'

export const removeArticle = (removeArticle, articles, manifests) => {
  const removeArticles = [].concat(removeArticle)
  return (dispatch) => {
    dispatch({
      type: ARTICLES_REMOVE_ARTICLE,
      payload: removeArticle
    })
    if (!!articles && articles !== undefined) {
      dispatch(publishArticles(articles.filter(articleItem => {
        return removeArticles.filter((removeArticleItem) => (removeArticleItem.id === articleItem.id)).length === 0
      }), manifests))
    }
  }
}

export const ARTICLES_MARK_READ = 'ARTICLES_MARK_READ'

const slowBlockstackPutFile = (filename, content) => {
  return blockstack.putFile(filename, content)
}
const blockstackPutFile = memoize(slowBlockstackPutFile, { promise: true })

export const markArticleRead = (articles, allArticles, manifests, blockstackUser) => {
  return (dispatch) => {
    dispatch({
      type: ARTICLES_MARK_READ,
      payload: articles
    })
    if (!blockstackUser.isAuthenticated) {
      return
    }
    dispatch(publishArticles([].concat(articles).map((stateArticle) => {
      let articleMatched = false
      articles = [].concat(articles)
      articles.map((toggleArticle) => {
        if (toggleArticle.id === stateArticle.id) {
          articleMatched = true
        }
        return 'o'
      })
      return (articleMatched === true ) ? { ...stateArticle, muted: true || false } : stateArticle
    }), manifests ))
  }
}

export const ARTICLES_TOGGLE_ARTICLE = 'ARTICLES_TOGGLE_ARTICLE'

export const toggleArticle = (articles, allArticles, manifests) => {
  return (dispatch) => {
    dispatch({
      type: ARTICLES_TOGGLE_ARTICLE,
      payload: articles
    })
    dispatch(publishArticles(articles.map((stateArticle) => {
      return { ...stateArticle, muted: !stateArticle.muted || true }
    }), manifests ))
  }
}

export const fetchArticles = (feeds, filters, manifests) => {
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
        dispatch(() => {
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
              .filter(articleItem => articleItem.title !== '')
              .map(articleItem => {
                if (!manifests) {
                  return articleItem
                }
                return {
                  ...articleItem,
                  muted: manifests
                  .filter(manifestItem => articleItem.articleId === manifestItem.articleId)
                  .filter(manifestItem => manifestItem.muted)[0] 
                  || articleItem.muted || false
                }
              })
              .map(articleItem => {
                try {
                  const blockReasons = filters
                  .filter(filterItem => !filterItem.muted )
                  .filter(filterItem => {
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
                    .filter(articleField => articleField !== 'id')
                    .filter(articleField => articleField !== 'feed')
                    .filter(articleField => articleField !== 'isoDate')
                    .filter(articleField => articleField !== 'guid')
                    .filter(articleField => articleField !== 'muted')
                    .filter(articleField => articleField !== 'pubDate')
                    .filter(articleField => {
                      return articleItem[`${articleField}`].indexOf(filterItem.text) !== -1
                    }).length !== 0 :
                    filterItem.fields.filter(filterItemFieldItem => filterItemFieldItem.name !== undefined).filter((filterItemFieldItem) => {
                      return articleItem[`${filterItemFieldItem.name}`].indexOf(filterItem.text) !== -1
                    }).length !== 0
                  })
                  return (blockReasons.length === 0) ? articleItem : {...articleItem, blockReasons: blockReasons, muted: true}
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
        })
      }
      return 'o'
    })
  }
}
export const fetchBlockstackArticles = (articles, manifests) => {
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
      if (manifests.filter((manifest) => manifest.sha1Hash === filename).length!== 0) {
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
      .catch((error) =>{
        dispatch({
          type: FETCH_SAVED_ARTICLE_FAIL,
          payload: error
        })
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

export const publishArticles = (articles, manifests) => {
  return (dispatch) => {
    dispatch({
      type: 'PUBLISH_ARTICLES_START',
      payload: articles
    })
    dispatch(() => {
      articles.map(articleItem => {
        const sha1Hash = hash.sha1(articleItem)
        dispatch(() => {
          manifests.filter((manifest) => manifest.articleId === articleItem.articleId)
          .filter((manifest) => (manifest.sha1Hash !== sha1Hash))
          .map(manifest => {
            if (!manifest) {
              return 'o'
            }
            dispatch({
              type: 'DELETE_MANIFEST_START',
              payload: manifest
            })
           // if cors errors persist for DELETE, publish empty file here.
            blockstack.deleteFile(`${manifest.sha1Hash}`)
            .then(() => dispatch({
              type: 'DELETE_MANIFEST_SUCCESS'
            }))
            .catch((error) => {
              dispatch({
                type: 'DELETE_MANIFEST_FAIL',
                payload: error
              })
            })
            return 'o'
          })
        })
        dispatch({
          type: 'PUBLISH_ARTICLE_START',
          payload: {
            sha1Hash: sha1Hash,
            articleId: articleItem.articleId
          }
        })
        dispatch(() => {
          blockstackPutFile( articleItem.articleId, JSON.stringify(articleItem))
          .then((gaiaUrl) => {
            const theDate = Date.now()
            //articleId: hash.sha1(item.link, salt)
            const thePayload = {
              gaiaUrl: gaiaUrl,
              link: articleItem.link,
              articleId: articleItem.articleId,
              muted: articleItem.muted,
              salt: articleItem.salt,
              date: theDate,
              sha1Hash: sha1Hash,
            }
            dispatch({
              type: 'PUBLISH_ARTICLE_SUCCESS',
              payload: thePayload
            })
            
            const newManifests = manifests.filter((manifestItem) => manifestItem.articleId !== thePayload.articleId).concat(thePayload)
  
            dispatch(() => {
              blockstackPutFile('manifests.json', JSON.stringify(newManifests))
              .then((manifestsURL) => {
                dispatch({
                  type: 'PUBLISH_MANIFESTS_SUCCESS',
                  payload: {
                    gaiaUrl: manifestsURL,
                    manifests: newManifests
                  }
                })
              })
            })
          })
        })
      return 'o'
      })
    })
  }
}
