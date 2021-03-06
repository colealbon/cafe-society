import * as blockstack from 'blockstack'

var memoize = require("memoizee")

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

export const updateFeed = feed => {
  return (dispatch) => {
    dispatch({
      type: FEED_UPDATE_FEED,
      payload: feed
    })
  }
}

export const PUBLISH_FEEDS_START = 'PUBLISH_FEEDS_START'
export const PUBLISH_FEEDS_SUCCESS = 'PUBLISH_FEEDS_SUCCESS'
export const PUBLISH_FEEDS_ERROR = 'PUBLISH_FEEDS_ERROR'

export const publishFeeds = (feeds) => {
  return (dispatch) => {
    dispatch({
      type: PUBLISH_FEEDS_START,
      payload: feeds
    })
    const fileContent = JSON.stringify(feeds)
    blockstack.putFile('feeds.json', fileContent)
    .then((response) => {
      dispatch({
        type: PUBLISH_FEEDS_SUCCESS,
        payload: {
          response: response,
          feeds: feeds
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: PUBLISH_FEEDS_ERROR,
        payload: {
          error: error
        }
      })
    })
  }
}

export const FEEDS_ADD_FEED = 'FEEDS_ADD_FEED'

export const addFeed = (feed, feeds) => {
  return (dispatch) => {
    dispatch({
      type: FEEDS_ADD_FEED,
      payload: {
        id: feed,
        url: feed
      }
    })
    dispatch(updateFeed(''))
    dispatch(publishFeeds(feeds.filter((filterFeed) => filterFeed.id !== feed).concat({id: feed, url: feed, muted: false})))
  }
}

export const FEEDS_REMOVE_FEED = 'FEEDS_REMOVE_FEED'

export const removeFeed = (removeFeed, feeds) => {
  const removeFeeds = [].concat(removeFeed)
  return (dispatch) => {
    dispatch({
      type: FEEDS_REMOVE_FEED,
      payload: removeFeed
    })
    if (!!feeds) {
      dispatch(publishFeeds(feeds.filter(feedItem => {
        return removeFeeds.filter((removeFeedItem) => (removeFeedItem.id === feedItem.id)).length === 0
      })))
    }
  }
}

export const FEEDS_TOGGLE_FEED = 'FEEDS_TOGGLE_FEED'

export const toggleFeed = (feed, feeds) => {
  return (dispatch) => {
    dispatch({
      type: FEEDS_TOGGLE_FEED,
      payload: {
        feed: feed
      }
    })
    dispatch(publishFeeds(feeds.filter((filterFeed) => filterFeed.id !== feed.id).concat({ ...feed, muted: !feed.muted || false })))
  }
}

export const FETCH_FEEDS_START = 'FETCH_FEEDS_START'
export const FETCH_FEEDS_SUCCESS = 'FETCH_FEEDS_SUCCESS'
export const FETCH_FEEDS_ERROR = 'FETCH_FEEDS_ERROR'

const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { promise: true, maxAge: 10000 })

export const FETCH_SAVED_FEEDS_START = 'FETCH_SAVED_FEEDS_START'
export const FETCH_SAVED_FEEDS_SUCCESS = 'FETCH_SAVED_FEEDS_SUCCESS'
export const FETCH_SAVED_FEEDS_FAIL = 'FETCH_SAVED_FEEDS_FAIL'

export const fetchBlockstackFeeds = () => {
  return (dispatch) => {
    blockstackGetFile('feeds.json')
    .then((savedFeeds) => {
      if (JSON.parse(savedFeeds === null)) {
        return
      }
      dispatch({
        type: FETCH_SAVED_FEEDS_SUCCESS,
        payload: JSON.parse(savedFeeds)
      })
    })
    .catch((error) => {
      dispatch({
        type: FETCH_SAVED_FEEDS_FAIL,
        payload: error
      })
    })
  }
}


export const fetchFeeds = (contacts, filters) => {
  return (dispatch) => {
    dispatch({ 
      type: FETCH_FEEDS_START,
      payload: {
        contacts: contacts,
        filters: filters
      }
     })
    const fetchFeedFileQueue = []
    fetchFeedFileQueue.push(new Promise((resolve) => {
      blockstackGetFile('feeds.json')
      .then((fileContents) => {
        if (fileContents === null) {
          resolve([])
        } else {
          resolve(
            JSON.parse(fileContents)
          )
        }
      })
      .catch(() => {
        resolve([])
      })
    }))
    // fetch feeds from each contact
    // if (!!contacts && contacts.length > 0) {
    //   contacts.filter((contact) => !contact.muted).map((contact) => {
    //     return fetchFeedFileQueue.push(new Promise((resolve) => {
    //       blockstackGetFile('feeds.json', {
    //         decrypt: false,
    //         username: contact.name
    //       })
    //       .then((fileContents) => {
    //         if (fileContents === null) {
    //           resolve([])
    //         } else {
    //           resolve(
    //             JSON.parse(fileContents)
    //             .map((feed) => {
    //               feed.source_contact = Object.assign(contact)
    //               feed.muted = true
    //               return(feed)
    //             })
    //           )
    //         }
    //       })
    //       .catch(() => {
    //         resolve([])
    //       })
    //     }))
    //   })
    // }

    Promise.all(fetchFeedFileQueue)
    .then((fetchedFeeds) => {
      const flattenedFeeds = fetchedFeeds.reduce((a, b) => !a ? b : [].concat(a).concat(b))
      const uniqueFeeds = []
      let dedup = {}
      flattenedFeeds.filter((feedItem) => !!feedItem)
      .filter((feedItem) => !Array.isArray(feedItem))
      .filter((feed) => {
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
    })
  }
}
