import * as blockstack from 'blockstack'
var bayes = require('bayes')

var memoize = require('memoizee')

export const CLASSIFIERS_ADD_CLASSIFIER = 'CLASSIFIERS_ADD_CLASSIFIER'

export const addClassifier = (classifier, classifiers) => {
  return (dispatch) => {
    dispatch({
      type: CLASSIFIERS_ADD_CLASSIFIER,
      payload: {
        classifier: classifier,
        classifiers: classifiers
      }
    })
    // dispatch(updateFeed(''))
    dispatch(publishClassifiers(classifiers.filter((filterClassifier) => filterClassifier.id !== classifier.id).concat(classifier)))
  }
}

const slowBlockstackGetFile = (filename, options) => {
  return blockstack.getFile(filename, options)
}
const blockstackGetFile = memoize(slowBlockstackGetFile, { promise: true, maxAge: 10000 })

export const CLASSIFIERS_REMOVE_CLASSIFIER = 'CLASSIFIERS_REMOVE_CLASSIFIER'

export const removeClassifier = (removeClassifier, classifiers) => {
  const removeClassifiers = [].concat(removeClassifier)
  return (dispatch) => {
    dispatch({
      type: CLASSIFIERS_REMOVE_CLASSIFIER,
      payload: removeClassifier
    })
    if (!!classifiers && classifiers !== undefined) {
      dispatch(publishClassifiers(classifiers.filter(classifierItem => {
        return removeClassifiers.filter((removeClassifierItem) => (removeClassifierItem.id === classifierItem.id)).length === 0
      })))
    }
  }
}

export const CLASSIFIERS_TOGGLE_CLASSIFIER = 'CLASSIFIERS_TOGGLE_CLASSIFIER'

export const toggleClassifier = (classifiers, allClassifiers) => {
  return (dispatch) => {
    dispatch({
      type: CLASSIFIERS_TOGGLE_CLASSIFIER,
      payload: classifiers
    })
    dispatch(publishClassifiers(allClassifiers.map((stateClassifier) => {
      let classifierMatched = false
      classifiers = [].concat(classifiers)
      classifiers.map((toggleClassifier) => {
        if (toggleClassifier.id === stateClassifier.id) {
          classifierMatched = true
        }
        return 'o'
      })
      return (classifierMatched === true ) ? { ...stateClassifier, muted: !stateClassifier.muted || false } : stateClassifier
    })))
  }
}

export const FETCH_CLASSIFIERS_START = 'FETCH_CLASSIFIERS_START'
export const FETCH_CLASSIFIERS_SUCCESS = 'FETCH_CLASSIFIERS_SUCCESS'
export const FETCH_CLASSIFIERS_FAIL = 'FETCH_CLASSIFIERS_FAIL'
export const FETCH_SAVED_CLASSIFIERS_SUCCESS = 'FETCH_SAVED_CLASSIFIERS_SUCCESS'
export const FETCH_SAVED_CLASSIFIERS_FAIL = 'FETCH_SAVED_CLASSIFIERS_FAIL'

export const fetchClassifiers = (contacts) => {
  return (dispatch) => {
    const classifiersRequestQueue = []
    classifiersRequestQueue.push(
      blockstackGetFile('classifiers.json', {
        decrypt: false
      })
      .then((savedClassifiers) => {
        if (!JSON.parse(savedClassifiers)) {
          return
        }
        dispatch({
          type: FETCH_SAVED_CLASSIFIERS_SUCCESS,
          payload: savedClassifiers
        })
      })
    )
    // contacts.map((contact) => {
    //   if (classifier.muted !== true && classifier.url) { 
    //     dispatch({
    //       type: FETCH_CLASSIFIERS_START,
    //       payload: {
    //         classifier: classifier,
    //         filters: filters
    //       }
    //     })
    //     fetchClassifierContent(classifier.url).then((fetchedContent) => {
    //       dispatch({
    //         type: 'FETCH_CLASSIFIERS_COMPLETE',
    //         payload: fetchedContent
    //       })
    //     })
    //   }
    //   return 'o'
    // })
  }}

export const PUBLISH_CLASSIFIERS_START = 'PUBLISH_CLASSIFIERS_START'
export const PUBLISH_CLASSIFIERS_SUCCESS = 'PUBLISH_CLASSIFIERS_SUCCESS'
export const PUBLISH_CLASSIFIERS_FAIL = 'PUBLISH_CLASSIFIERS_FAIL'

export const publishClassifiers = (classifiers) => {
  return (dispatch) => {
    dispatch({
      type: 'PUBLISH_CLASSIFIERS_START',
      payload: classifiers
    })
    const fileContent = JSON.stringify(classifiers)
    return blockstack.putFile('classifiers.json', fileContent, {encrypt: false})
    .then((response) => {
      dispatch({
        type: PUBLISH_CLASSIFIERS_SUCCESS,
        payload: {
          response: response
        }
      })
    }).catch((error) => {
      dispatch({
        type: PUBLISH_CLASSIFIERS_FAIL,
        payload: {
          error: error
        }
      })
    })
  }
}

export const CLASSIFIERS_LEARN_START = 'CLASSIFIERS_LEARN_START'
export const CLASSIFIERS_LEARN_SUCCESS = 'CLASSIFIERS_LEARN_SUCCESS'
export const CLASSIFIERS_LEARN_FAIL = 'CLASSIFIERS_LEARN_FAIL'

export const learn = (category, selectedSection, article, classifiers) => {

  return (dispatch) => {
    dispatch({
      type: CLASSIFIERS_LEARN_START,
      payload: {
        category: category,
        selectedSection: selectedSection,
        article: article,
        classifiers: classifiers
      }
    })
    try {
      classifiers = (classifiers.length !== 0) ? classifiers :  [
        {
          id: `title${selectedSection.id}`,
          field: 'title',
          section:  selectedSection,
          category: category
        },
        {
          id: `contentSnippet${selectedSection.id}`,
          field: 'contentSnippet',
          section: selectedSection,
          category: category
        }
      ]
      dispatch({
        type: CLASSIFIERS_LEARN_SUCCESS,
        payload: 
        classifiers.map((classifier) => {
          return Object.keys(article).map((articleField) => {
            if (classifier.id === `${articleField}${selectedSection.id}`) {
              let bayesClassifier = bayes(classifier.bayes)
              let betterClassifier = bayesClassifier.learn(article[`${classifier.field}`], category)
              classifier.bayes = betterClassifier
              return classifier
            }
            return null
          })
        }).reduce((a, b) => a.concat(b))
        .filter((x) => !!x)
      })
    } catch(error) {
      dispatch({
        type: CLASSIFIERS_LEARN_FAIL,
        payload: error
      })
    }
  }
}