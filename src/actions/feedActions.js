import * as blockstack from 'blockstack'
import { fetchBlockstackArticles } from './articleActions'

var memoize = require("memoizee");

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

export const updateFeed = text => {
  return (dispatch) => {
    dispatch({
      type: FEED_UPDATE_FEED,
      payload: {name: text}
    })
  }
}

export const FEEDS_ADD_FEED = 'FEEDS_ADD_FEED'

export const addFeed = name => {
  return (dispatch) => {
    dispatch({
      type: FEEDS_ADD_FEED,
      payload: {
        id: name.toLowerCase().replace(' ', '-'),
        name: name
      }
    })
    updateFeed({name: ''})
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

export const FEEDS_TOGGLE_FEED = 'FEEDS_TOGGLE_FEED'

export const toggleFeed = feed => {
  return (dispatch) => {
    dispatch({
      type: FEEDS_TOGGLE_FEED,
      payload: feed
    })
  }
}

export const PUBLISH_FEEDS_REQUEST = 'PUBLISH_FEEDS_REQUEST'
export const PUBLISH_FEEDS_SUCCESS = 'PUBLISH_FEEDS_SUCCESS'
export const PUBLISH_FEEDS_ERROR = 'PUBLISH_FEEDS_ERROR'
export const FETCH_FEEDS_REQUEST = 'FETCH_FEEDS_REQUEST'
export const FETCH_FEEDS_SUCCESS = 'FETCH_FEEDS_SUCCESS'
export const FETCH_FEEDS_ERROR = 'FETCH_FEEDS_ERROR'

const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { maxAge: 10000 })

export const fetchBlockstackFeeds = (contacts) => {
  return (dispatch) => {
    dispatch({ type: FETCH_FEEDS_REQUEST })
    const fetchFeedFileQueue = []
    fetchFeedFileQueue.push(new Promise((resolve, reject) => {
      blockstackGetFile('feeds.json', {
        decrypt: false
      })
      .then((fileContents) => resolve((JSON.parse(fileContents))))
      .catch((error) => reject(error))
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
                    feed.muted = false
                    return(feed)
                  })
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
      const flattenedFeeds = fetchedFeeds.reduce((a, b) => !a ? b : a.concat(b))
      const uniqueFeeds = []
      let dedup = {}
      if ((flattenedFeeds || []).length < 1) {
        const theUniqueFeeds = [
          {
            id:'https://www.democracynow.org/democracynow.rss',
            url: 'https://www.democracynow.org/democracynow.rss',
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
            id:'https://findyourfate.com/rss/horoscope-astrology.php',
            url: 'https://findyourfate.com/rss/horoscope-astrology.php',
            muted: false,
            sections: [
              {
                id:'horoscope',
                name: 'horoscope',
                muted: false
              }
            ]
          }
        ]
        dispatch(fetchBlockstackArticles(theUniqueFeeds.filter((feed) => !feed.muted)))
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
        dispatch(fetchBlockstackArticles(uniqueFeeds.filter((feed) => !feed.muted)))
      }
    })
  }
}

export const publishFeeds = (feeds) => {
  return (dispatch) => {
    dispatch({
      type: PUBLISH_FEEDS_REQUEST,
      payload: feeds
    })
    const fileContent = JSON.stringify(feeds)
    return blockstack.putFile('feeds.json', fileContent, {encrypt: false})
      .then(() => {
        dispatch({
          type: PUBLISH_FEEDS_SUCCESS
        })
      }
    )
  }
}
