import * as blockstack from 'blockstack'
var memoize = require("memoizee")
import { fetchArticles } from './articleActions'

export const FEED_SELECT_FEED = 'FEED_SELECT_FEED'

export const selectFeed = feed => {
  return (dispatch) => {
    dispatch({
      type: FEED_SELECT_FEED,
      payload: feed
    })
  }
}

export const FEED_UPDATE_FEED = 'FEED_UPDATE_FEED'

export const updateFeed = url => {
  return (dispatch) => {
    dispatch({
      type: FEED_UPDATE_FEED,
      payload: {url: url}
    })
  }
}

export const FEEDS_ADD_FEED = 'FEEDS_ADD_FEED'

export const addFeed = url => {
  return (dispatch) => {
    dispatch({
      type: FEEDS_ADD_FEED,
      payload: {
        id: url,
        url: url
      }
    })
    updateFeed({url: ''})
  }
}

export const FEEDS_UPSERT_FEED = 'FEEDS_UPSERT_FEED'

export const upsertFeed = feed => {
  return (dispatch) => {
    dispatch({
      type: FEEDS_UPSERT_FEED,
      payload: feed
    })
    updateFeed({url: ''})
  }
}

export const FEEDS_REMOVE_FEED = 'FEEDS_REMOVE_FEED'

export const removeFeed = feed => {
  return (dispatch) => {
    dispatch({
      type: FEEDS_REMOVE_FEED,
      payload: feed
    })
  }
}

export const PUBLISH_FEEDS_REQUEST = 'PUBLISH_FEEDS_REQUEST'
export const PUBLISH_FEEDS_SUCCESS = 'PUBLISH_FEEDS_SUCCESS'
export const PUBLISH_FEEDS_ERROR = 'PUBLISH_FEEDS_ERROR'

export const publishFeeds = (feeds) => {
  if (!!feeds) {
    return (dispatch) => {
      dispatch({
        type: PUBLISH_FEEDS_REQUEST,
        payload: feeds
      })
      const fileContent = JSON.stringify(feeds)
      return blockstack.putFile('feeds.json', fileContent, {encrypt: false})
        .then((response) => {
          dispatch({
            type: PUBLISH_FEEDS_SUCCESS,
            payload: {
              response: response,
              feeds: feeds
            }
          })
        }
      )
    }
  }
}

export const FEEDS_TOGGLE_FEED = 'FEEDS_TOGGLE_FEED'

export const toggleFeed = (feed, feeds) => {
  return (dispatch) => {
    dispatch({
      type: FEEDS_TOGGLE_FEED,
      payload: {
        feed: feed,
        feeds: feeds
      }
    })
    const newFeeds = feeds.filter((filterFeed) => filterFeed.id !== feed.id).concat({ ...feed, muted: !feed.muted || false })
    dispatch(publishFeeds(newFeeds))
  }
}

export const FETCH_FEEDS_REQUEST = 'FETCH_FEEDS_REQUEST'
export const FETCH_FEEDS_SUCCESS = 'FETCH_FEEDS_SUCCESS'
export const FETCH_FEEDS_ERROR = 'FETCH_FEEDS_ERROR'

const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { maxAge: 10000 })

export const fetchBlockstackFeeds = (contacts, filters, feeds) => {
  return (dispatch) => {
    dispatch({ type: FETCH_FEEDS_REQUEST })
    const fetchFeedFileQueue = []
    fetchFeedFileQueue.push(new Promise((resolve) => {
      blockstackGetFile('feeds.json', {
        decrypt: false,
      })
      .then((fileContents) => {
        if (fileContents === null) {
          resolve([])
        } else {
          resolve(
            JSON.parse(fileContents)
            .map((feed) => {
              return(feed)
            }).concat(feeds)
          )
        }
      })
      .catch(() => {
        resolve([])
      })
    }))
    if (!!contacts && contacts.length > 0) {
      contacts.filter((contact) => !contact.muted).map((contact) => {
        return fetchFeedFileQueue.push(new Promise((resolve) => {
          blockstackGetFile('feeds.json', {
            decrypt: false,
            username: contact.name
          })
          .then((fileContents) => {
            if (fileContents === null) {
              resolve([])
            } else {
              resolve(
                JSON.parse(fileContents)
                .map((feed) => {
                  feed.source_contact = Object.assign(contact)
                  feed.muted = true
                  return(feed)
                }).concat(feeds)
              )
            }
          })
          .catch(() => {
            resolve([])
          })
        }))
      })
    }

    Promise.all(fetchFeedFileQueue)
    .then((fetchedFeeds) => {
      const flattenedFeeds = fetchedFeeds.reduce((a, b) => !a ? b : [].concat(a).concat(b))
      const uniqueFeeds = []
      let dedup = {}
      if ((flattenedFeeds || []).length < 1) {
        const theUniqueFeeds = [
          {
            id:'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en',
            url: 'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en',
            muted: false 
          },
          {
            id:'https://lifehacker.com/rss',
            url: 'lifehacker.com/rss',
            muted: false ,
            sections: [
              {
                id:'politics',
                name: 'politics',
                muted: false
              }
            ]
          },
          {
            id:'https://www.democracynow.org/democracynow.rss',
            url: 'https://www.democracynow.org/democracynow.rss',
            muted: true ,
            sections: [
              {
                id:'politics',
                name: 'politics',
                muted: false
              }
            ]
          }
        ]
        dispatch(fetchArticles(theUniqueFeeds, filters))
        //fetchArticles(theUniqueFeeds, filters)
        dispatch(publishFeeds(theUniqueFeeds))
        dispatch({
          type: FETCH_FEEDS_SUCCESS,
          payload: theUniqueFeeds
        })
      } else {
        flattenedFeeds.filter((feed) => {
          if (dedup[feed.id] === undefined) {
            dedup[feed.id] = {}
            uniqueFeeds.push(feed)
            return true
          }
          return false
        })
        dispatch({
          type: FETCH_FEEDS_SUCCESS,
          payload: uniqueFeeds
        })
        dispatch(publishFeeds(uniqueFeeds))
        dispatch(fetchArticles(uniqueFeeds, filters))
      }
    })
  }
}
