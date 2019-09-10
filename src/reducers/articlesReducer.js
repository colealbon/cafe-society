import {
  ARTICLES_REMOVE_ARTICLE,
  ARTICLES_TOGGLE_ARTICLE,
  FETCH_FEED_CONTENT_SUCCESS,
  FETCH_SAVED_ARTICLE_SUCCESS,
  ARTICLES_MARK_READ
} from '../actions/articleActions'

import {
  SECTION_SELECT_SECTION
} from '../actions/sectionActions'

import {
  FILTERS_ADD_FILTER
} from '../actions/filterActions'

import {
  FILTER_SECTION_SELECT_SECTION
} from '../actions/filterSectionActions'

import {
  FILTER_FIELD_SELECT_FIELD
} from '../actions/filterFieldActions'

import {
  CLASSIFIERS_LEARN_SUCCESS
} from '../actions/classifierActions'

var bayes = require('classificator')

export default (state = [], action) => {
  switch (action.type) {

    case 'RESET_APP':
      return []

    case FETCH_SAVED_ARTICLE_SUCCESS:
      return state.filter((stateItem) => stateItem.link !== action.payload.link).concat(action.payload)

    case FETCH_FEED_CONTENT_SUCCESS:

      if (!action.payload.fetchedContent) {
        return state
      }
      // remove article items that no longer exist in feed
      // add any new items from feed
      return [].concat(action.payload.fetchedContent.items).length === 0 ?
      state :
      state.filter(
        stateItem => stateItem.feed.id !== action.payload.feed.id ?
        true :
        [].concat(action.payload.fetchedContent.items)
        .filter(payloadItem => payloadItem.link === stateItem.link)
        .length !== 0
      )
      .concat(action.payload.fetchedContent.items
        .filter(payloadItem => [].concat(state)
          .filter(stateItem => payloadItem.link === stateItem.link).length === 0
        )
      )
      .map(articleItem => {
        // merge article (which we just fetched) with manifest with same link
        // where fields overlap, manifest overwrites article
        return {
          ...action.payload.manifests
            .filter(manifestItem => articleItem.link === manifestItem.link)[0],
          ...articleItem
        }
      })
      .map(articleItem => {
        // apply manual filters
        if ([].concat(action.payload.filters).length === 0) {
          return state
        }
        const blockReasons = [].concat(action.payload.filters)
        .filter(filterItem => !filterItem.muted )
        .filter(filterItem => {
          return ([].concat(filterItem.sections).length === 0) ?
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
      })

    case ARTICLES_MARK_READ:
      return state.map(stateItem => {
        return {
          ...stateItem,
          muted: [].concat(action.payload).filter(payloadItem => payloadItem.link === stateItem.link).length === 0 ?
          stateItem.muted :
          true
        }
      })

    case ARTICLES_REMOVE_ARTICLE:
      return state.filter(stateItem => {
        let payload = Array.isArray(action.payload) ? action.payload : [action.payload]
        return payload.filter((payloadItem) => (payloadItem.link === stateItem.link)).length === 0
      })

    case ARTICLES_TOGGLE_ARTICLE:
      return state.map(article => article.link === action.payload.link ? { ...article, muted: !article.muted || false } : article )

    case "@@router/LOCATION_CHANGE":
      return state.map(article => action.payload.location.pathname === "/" ? { ...article, visible: true } : article)

    case SECTION_SELECT_SECTION:
      return state.map(article => {
        if ((article.feed || []).length < 1) {
          return { ...article, visible: false }
        }
        if ((article.feed.sections || []).length < 1) {
          return { ...article, visible: false }
        }
        let matchedSection = (article.feed.sections || []).map((section) => {
          return action.payload.name === section.name
        }).filter((matchedSection) => matchedSection === true)
        return  (matchedSection || []).length > 0  ?  { ...article, visible: true } : { ...article, visible: false } 
      })

    case FILTER_SECTION_SELECT_SECTION:
      const isToggleOff = [].concat(action.payload.sections).filter((filterSection) => {
        if (filterSection === undefined) {
          return false
        }
        return action.payload.section.id === (filterSection.id || true)
      }).length > 0

      if (!!action.payload.muted) {
        return state
      }

      if (isToggleOff) {
        return state.map((article) => {     
          let newBlockReasons = (article.blockReasons || []).filter((blockReason) => blockReason.id !== action.payload.id)
          let articleMuted = newBlockReasons.length > 0
          return ({...article, muted: articleMuted, blockReasons: newBlockReasons })
        })
      }

      return state.map((article) => {
        const matchedFilter = (action.payload.fields.filter((fieldItem) => !!fieldItem.name)
          .map((filterField) => {
          if ((article[`${filterField.name}`]).indexOf(action.payload.text) !== -1) {
            if (article.feed.sections === undefined) {
              return true
            } else {
              article.feed.sections.map((feedSection) => {
                if (feedSection === undefined) {
                  return false
                }
                if (action.payload.section === undefined) {
                  return false
                }
                if ((feedSection.id || action.payload.section.id) === action.payload.section.id) {
                  return true
                }
                return false
              })
            }
          }
          return 'o'
        }).filter((filterMatched) => filterMatched === true).length > 0)
        return (
          (matchedFilter) ?
          {...article, muted: true , blockReasons: (article.blockReasons || []).filter((blockReason) => blockReason.id !== action.payload.id).concat(action.payload)} :
          article
        )
      })

    case FILTER_FIELD_SELECT_FIELD:
      const isToggleOffField = [].concat(action.payload.fields).filter((filterField) => {
        if (filterField === undefined) {
          return false
        }
        return action.payload.field.id === (filterField.id || true)
      }).length > 0
      if (isToggleOffField) {
        return state.map((article) => {
          const matchedFilter = (action.payload.fields.map((filterField) => {
            if ((article[`${filterField.name}`]).indexOf(action.payload.text) !== -1) {
              return true
            }
            return false
          }).filter((filterMatched) => filterMatched === true).length > 0)
    
          return (
            (matchedFilter) ?
            {...article, blockReasons: (article.blockReasons || []).filter((blockReason) => blockReason.id !== action.payload.id)} :
            article
          )
        })
      }
      return state.map((article) => {
        const matchedFilter = ([].concat(action.payload.fields)
          .filter(filterField => !!filterField)
          .map((filterField) => {
          if ((article[`${filterField.name}`]).indexOf(action.payload.text) !== -1) {
            return true
          }
          return false
        }).filter((filterMatched) => filterMatched === true).length > 0)
  
        return (
          (matchedFilter) ?
          {...article, blockReasons: (article.blockReasons || []).filter((blockReason) => blockReason.id !== action.payload.id).concat(action.payload)} :
          article
        )
      })

  case FILTERS_ADD_FILTER:
    if (action.payload.id === '') {
      return state
    }
    if (!action.payload.fields) {
      return state
    }
    if (!!action.payload.muted) {
      return state
    }
    return state.map((article) => {
      const matchedFilter = (action.payload.fields.map((filterField) => {
        if (!filterField.name) {
          return false
        }
        if (!(article[`${filterField.name}`])) {
          return false
        }
        if ((article[`${filterField.name}`]).indexOf(action.payload.text) !== -1) {
          if (article.feed.sections === undefined) {
            return true
          } else {
            article.feed.sections.map((feedSection) => {
              if (feedSection === undefined) {
                return true
              }
              if (action.payload.section === undefined) {
                return true
              }
              if ((feedSection.id ||  action.payload.section.id) === action.payload.section.id) {
                return true
              }
              return false
            })
          }
          return true
        }
        return false
      }).filter((filterMatched) => filterMatched === true).length > 0)

      if (article.blockReasons) {
        return (
          (matchedFilter) ?
          {...article, muted: true, blockReasons: article.blockReasons.filter((blockReason) => blockReason.id !== action.payload.id).concat(action.payload) } :
          article
        )
      }
      return (
        (matchedFilter) ?
        {...article, muted: true, blockReasons: [action.payload] } :
        article
      )

  })  

  case CLASSIFIERS_LEARN_SUCCESS:
    return state.map((article) => {
      if (article.muted === true) {
        return article
      }
      if (article.visible === false) {
        return article
      }
      return {
        ...article,
        classifiers: action.payload,
      }
    })
    .map((article) => {
      if (article.muted === true) {
        return article
      }
      if (article.visible === false) {
        return article
      }
      try {
        delete article.classifiers
      } catch (error) {
        // pass
      }
      return {
        ...article,
        classifiers: action.payload.filter((classifier) => {
          if (classifier.id === ''){
            return true
          }
          if (!article.feed.sections) {
            return false
          }
          return article.feed.sections.filter((articleSection) => {
            return articleSection.id === classifier.id
          }).length !== 0
        })
      }
    })
  .map((article) => {
    if (article.muted === true) {
      return article
    }
    if (article.visible === false) {
      return article
    }
    try {
      delete article.bayesCategories
    } catch {
      // pass
    }
      return {
        ...article,
        bayesCategories: article.classifiers.map((classifier) => {
          if (!classifier.bayesJSON) {
            return  null
          }
          let bayesClassifier = (classifier.bayesJSON) ? bayes.fromJson(classifier.bayesJSON) :  bayes()
          let bayesCategory = bayesClassifier.categorize(article.title.concat(article.contentSnippet))
          return {
            classifier: classifier.id,
            category: bayesCategory
          }
        })
        .filter((classifier) => classifier !== null)
        .filter((classifier) => classifier.category !== undefined)
      }
   })

  default:
      return state
  }
}
