import * as blockstack from 'blockstack'
import uuid from 'uuidv4'
let Parser = require('rss-parser')
let parser = new Parser()
var memoize = require("memoizee")

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

export const ARTICLES_REMOVE_ARTICLE = 'ARTICLES_REMOVE_ARTICLE'
export const MANIFESTS_REMOVE_MANIFEST = 'MANIFESTS_REMOVE_MANIFEST'

export const removeArticle = (article) => {
  const articles = [].concat(article)
  return (dispatch) => {
    dispatch({
      type: ARTICLES_REMOVE_ARTICLE,
      payload: articles
    })
    dispatch({
      type: MANIFESTS_REMOVE_MANIFEST,
      payload: articles
    })
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
    if (blockstackUser.isAuthenticated !== true) {
      console.log('anonymous markArticleRead - bail')
      return
    }
    dispatch(() => {
      const newManifests = manifests.filter(manifestItem => {
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
      const fileContent = JSON.stringify(newManifests)
      blockstack.putFile('manifests.json', fileContent)
      .then((response) => {
        dispatch({
          type: PUBLISH_MANIFESTS_SUCCESS,
          payload: {
            response: response,
            manifests: manifests.filter(manifestItem => manifestItem.muted === true)
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
    // dispatch(publishArticles(articles.map((stateArticle) => {
    //   return { ...stateArticle, muted: !stateArticle.muted || true }
    // }), manifests ))
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
            // manifests no longer in the feed we just pulled
            const orphanedManifests = manifests
              .filter(manifestItem => manifestItem.feed.id === feed.id)
              .filter(manifestItem => !fetchedContent.items.filter(articleItem => articleItem.link = manifestItem.link))

            if (orphanedManifests.length !== 0) {
              dispatch({
                type: 'ORPHAN_MANIFEST_FOR_FEED',
                payload: {
                  feed: feed,
                  orphanedManifests: orphanedManifests
                }
              })
            }

            dispatch({
              type: FETCH_ARTICLES_SUCCESS,
              payload: {
                feed: feed,
                articles: 
                  fetchedContent.items
                  .filter(articleItem => articleItem.title !== '')
                  .map((item) => {
                    return {
                      ...item,
                      articleId: uuid(),
                      feed: feed
                    }
                  })
                  .map(articleItem => {
                    if (!manifests) {
                      return articleItem
                    }
                    return {
                      ...articleItem,
                      muted: manifests
                      .filter(manifestItem => articleItem.link === manifestItem.link)
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
              }
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