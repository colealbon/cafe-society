import * as blockstack from 'blockstack'
const bayes = require('classificator')

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

export const fetchBlockstackClassifiers = (classifiers) => {
  return (dispatch) => {
    blockstackGetFile('classifiers.json')
    .then((savedClassifiers) => {
      if (JSON.parse(savedClassifiers) === null) {
        return 
      }
      dispatch({
        type: FETCH_SAVED_CLASSIFIERS_SUCCESS,
        payload: JSON.parse(savedClassifiers)
      })
    })
  }
}

export const PUBLISH_CLASSIFIERS_START = 'PUBLISH_CLASSIFIERS_START'
export const PUBLISH_CLASSIFIERS_SUCCESS = 'PUBLISH_CLASSIFIERS_SUCCESS'
export const PUBLISH_CLASSIFIERS_FAIL = 'PUBLISH_CLASSIFIERS_FAIL'

export const publishClassifiers = (classifiers) => {
  return (dispatch) => {
    if ([].concat(classifiers).length === 0) {
      dispatch({
        type: PUBLISH_CLASSIFIERS_FAIL,
        payload: {reason: 'empty classifier list'}
      })
      return
    }
    dispatch({
      type: 'PUBLISH_CLASSIFIERS_START',
      payload: classifiers
    })
    const fileContent = JSON.stringify(classifiers)
    return blockstack.putFile('classifiers.json', fileContent)
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
      const overwrite = classifiers.filter((classifier) => classifier !== null).filter((classifier) => classifier.id === selectedSection.id)
      classifiers = (overwrite.length !== 0) ? 
        classifiers : 
        classifiers.concat({id: selectedSection.id})
      const newClassifiers = classifiers.filter((classifier) => classifier !== null)
          .filter((classifier) => classifier.id === selectedSection.id)
          .map((classifier) => {
            if (classifier.id === selectedSection.id) {
              let bayesClassifier = (classifier.bayesJSON) ? bayes.fromJson(classifier.bayesJSON) : bayes()
              bayesClassifier.learn(article.title.concat(article.contentSnippet), category)
              classifier.bayesJSON = bayesClassifier.toJson()
              return classifier
            }
            return null
          }).filter((classifier) => classifier !== null)
          .concat(classifiers.filter((classifier) => classifier.id !== selectedSection.id))
      dispatch({
        type: CLASSIFIERS_LEARN_SUCCESS,
        payload: newClassifiers
      })
      dispatch(publishClassifiers(newClassifiers))
    } catch(error) {
      dispatch({
        type: CLASSIFIERS_LEARN_FAIL,
        payload: error
      })
    }
  }
}
