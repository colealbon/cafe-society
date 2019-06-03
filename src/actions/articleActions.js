import * as blockstack from 'blockstack'

let Parser = require('rss-parser');
let parser = new Parser();

export const PUBLISH_ARTICLES_REQUEST = 'PUBLISH_ARTICLES_REQUEST'
export const PUBLISH_ARTICLES_SUCCESS = 'PUBLISH_ARTICLES_SUCCESS'
export const PUBLISH_ARTICLES_ERROR = 'PUBLISH_ARTICLES_ERROR'

export const FETCH_ARTICLES_REQUEST = 'FETCH_ARTICLES_REQUEST'
export const FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS'
export const FETCH_ARTICLES_ERROR = 'FETCH_ARTICLES_ERROR'

export const ARTICLE_UPDATE_ARTICLE = 'ARTICLE_UPDATE_ARTICLE'

export const updateArticle = text => {
  return (dispatch) => {
    dispatch({
      type: ARTICLE_UPDATE_ARTICLE,
      payload: {url: text}
    })
  }
}

export const ARTICLES_ADD_ARTICLE = 'ARTICLES_ADD_ARTICLE'

export const addArticle = url => {
  return (dispatch) => {
    dispatch({
      type: ARTICLES_ADD_ARTICLE,
      payload: {
        id: url,
        url: url
      }
    })
    updateArticle({url: ''})
  }
}

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

export const toggleArticle = article => {
  return (dispatch) => {
    dispatch({
      type: ARTICLES_TOGGLE_ARTICLE,
      payload: article
    })
  }
}

export const fetchBlockstackArticles = (feeds) => {
  return (dispatch) => {
    const fetchArticleFileQueue = []
    fetchArticleFileQueue.push(new Promise((resolve, reject) => {
      blockstack.getFile('articles.json', {
        decrypt: true
      })
      .then((fileContents) => {
        resolve(JSON.parse(fileContents))
      })
      .catch((error) => reject(error))
    }))
    feeds.filter((feed) => !feed.muted).map((feed) => {
      if (feed.muted === true) {
        return 'o'
      }
      return fetchArticleFileQueue.push(new Promise((resolve) => {
        const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
        parser.parseURL(CORS_PROXY + feed.url)
        .then((feedContent) => {
          resolve(feedContent.items.map((article) => {
            article.muted = false
            article.contentSnippet = !article.contentSnippet ? '' : article.contentSnippet.replace(/&amp;nbsp;/g," ").replace(/&nbsp;/g," ")
            return(Object.assign({id: article.link, feed: feed}, article))
          }))
        })
        .catch(() => {
          const CORS_PROXY = 'https://cors.io/?'
          parser.parseURL(CORS_PROXY + feed.url)
          .then((feedContent) => {
            resolve(feedContent.items.map((article) => {
              article.muted = false
              article.feed = feed
              article.contentSnippet = !article.contentSnippet ? '' : article.contentSnippet.replace(/&amp;nbsp;/g," ").replace(/&nbsp;/g," ")
              return(Object.assign({id: article.link}, article))
            }))
          })
          .catch(() => {
            alert(`bad feed - remove or disable ${feed.url} then publish feeds to blockstack`)
            return
          })
        })
      }))
    })
    Promise.all(fetchArticleFileQueue)
    .then((fetchedArticles) => {
      const flattenedArticles = fetchedArticles.reduce((a, b) => !a ? b : a.concat(b))
      let dedup = {};
      let dedupTitle = {};
      const uniqueArticles = []
      flattenedArticles.map((article) => {
        if (dedup[article.id] === undefined && dedupTitle[article.title] === undefined) {
          dedup[article.id] = {}
          dedupTitle[article.title] = {}
          let surpress = false
          if (surpress === false) {
            uniqueArticles.push(article)
          }
        }
        return 'o'
      })
      if (!uniqueArticles) {
        dispatch({
          type: FETCH_ARTICLES_SUCCESS,
          payload: [{title: 'NO ARTICLES', link:''}]
        })
      } else {
        dispatch({
          type: FETCH_ARTICLES_SUCCESS,
          payload: uniqueArticles
        })
      }
    })
  }
}

export const publishArticles = (articles) => {
  return (dispatch) => {
    dispatch({
      type: PUBLISH_ARTICLES_REQUEST,
      payload: articles
    })
    const fileContent = JSON.stringify(articles)
    return blockstack.putFile('articles.json', fileContent, {encrypt: true})
      .then(() => {
        dispatch({
          type: PUBLISH_ARTICLES_SUCCESS
        })
        //dispatch(fetchBlockstackFriends())
      }
    )
  }
}
