var flatten = require('@flatten/array')

import {
  ARTICLES_REMOVE_ARTICLE,
  ARTICLES_TOGGLE_ARTICLE,
  FETCH_ARTICLES_SUCCESS,
  FETCH_SAVED_ARTICLES_SUCCESS,
  ARTICLES_MARK_READ
} from '../actions/articleActions'

import {
  SECTION_SELECT_SECTION
} from '../actions/sectionActions'

import {
  FILTERS_ADD_FILTER,
  FILTERS_REMOVE_FILTER,
  FILTERS_TOGGLE_FILTER
} from '../actions/filterActions'

import {
  FILTER_SECTION_SELECT_SECTION
} from '../actions/filterSectionActions'

import {
  FILTER_FIELD_SELECT_FIELD
} from '../actions/filterFieldActions'

// const applyFilters = (articles, filters) => {
//   return articles.map(articleItem =>  {
//     const blockReasons = Object.assign(
//       [].concat(filters).filter(filterItem => !filterItem.muted)
//       .filter((filterItem) => {
//         if (!filterItem.fields !! filterItem.fields === []) {
//           return !!Object.keys(articleItem)
//           .filter((articleField) => articleField !== 'id')
//           .filter((articleField) => articleField !== 'feed')
//           .filter((articleField) => articleField !== 'isoDate')
//           .filter((articleField) => articleField !== 'guid')
//           .filter((articleField) => articleField !== 'muted')
//           .filter((articleField) => articleField !== 'pubDate')
//           .filter((articleField) => {
//             return articleItem[`${articleField}`].indexOf(filterItem.text) !== -1
//           })
//         }
//         return filterItem.fields.filter((fieldItem) => !!fieldItem.name)
//       })
//     )
//     if (blockReasons.length === 0) {
//       return Object.assign(articleItem)
//     }
//     return Object.assign(articleItem, {blockReasons: blockReasons})
//   })
// }

export default (state = [], action) => {
  switch (action.type) {

    case 'RESET_APP':
        return []
        
    case FETCH_SAVED_ARTICLES_SUCCESS:
      // selectively overwrite article cache with blockstack version
      return flatten(state.map((stateArticleItem) => {
        const overwrite = action.payload.articles.filter((payloadArticleItem) => payloadArticleItem.id === stateArticleItem.id)[0]
        return (!!overwrite) ? overwrite : stateArticleItem
      })
      .concat((action.payload.articles).filter((payloadItem) => {
        let itemExists = false
        state.map((stateItem) => {
          if (stateItem.id === payloadItem.id) {
            itemExists = true
          }
        })
        return !itemExists
      })))
      .map(articleItem => {
        const blockReasons = action.payload.filters
        .filter((filterItem) => !filterItem.muted )
        .filter((filterItem) => {
          return (filterItem.sections === undefined || filterItem.sections.length === 0) ?
          true :
          filterItem.sections.filter((filterItemSectionItem) => {
            return articleItem.feed.sections.filter((articleItemSectionItem) => {
              return articleItemSectionItem.id == filterItemSectionItem.id
            }).length !== 0
          }).length !==0
        })
        .filter(filterItem => {
          return (filterItem.fields == undefined || filterItem.fields.length == 0) ?
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
          filterItem.fields.filter((filterItemFieldItem) => {
            return articleItem[`${filterItemFieldItem.name}`].indexOf(filterItem.text) !== -1
          }).length !== 0
        })
        return (blockReasons.length === 0) ? articleItem : Object.assign( articleItem, {blockReasons: blockReasons, muted: true})
      })

    case FETCH_ARTICLES_SUCCESS:
      return flatten(state.concat(action.payload.articles.filter((newArticle) => {
        const articleExists = state.filter((stateArticle) => stateArticle.id === newArticle.id).length !== 0
        return !articleExists
      }))).filter((articleItem) => articleItem.title != '')
      .map(articleItem => {
        const blockReasons = action.payload.filters
        .filter((filterItem) => !filterItem.muted )
        .filter((filterItem) => {
          return (filterItem.sections === undefined || filterItem.sections.length === 0) ?
          true :
          filterItem.sections.filter((filterItemSectionItem) => {
            return articleItem.feed.sections.filter((articleItemSectionItem) => {
              return articleItemSectionItem.id == filterItemSectionItem.id
            }).length !== 0
          }).length !==0
        })
        .filter(filterItem => {
          return (filterItem.fields == undefined || filterItem.fields.length == 0) ?
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
          filterItem.fields.filter((filterItemFieldItem) => {
            return articleItem[`${filterItemFieldItem.name}`].indexOf(filterItem.text) !== -1
          }).length !== 0
        })
        return (blockReasons.length === 0) ? articleItem : Object.assign( articleItem, {blockReasons: blockReasons, muted: true})
      })

    case ARTICLES_MARK_READ:
      return state.map(stateItem => {
        let payload = Array.isArray(action.payload) ? action.payload : [action.payload]
        let muteArticle = payload.filter((payloadItem) => (payloadItem.id === stateItem.id)).length !== 0
        return (muteArticle === true) ? { ...stateItem, muted: true} : stateItem
      })

    case ARTICLES_REMOVE_ARTICLE:
      return state.filter(stateItem => {
        let payload = Array.isArray(action.payload) ? action.payload : [action.payload]
        return payload.filter((payloadItem) => (payloadItem.id === stateItem.id)).length === 0
      })

    case ARTICLES_TOGGLE_ARTICLE:
      return state.map(article => article.id === action.payload.id ? { ...article, muted: !article.muted || false } : article )

    case "@@router/LOCATION_CHANGE":
      return [].concat(state).map(article => action.payload.location.pathname === "/" ? { ...article, visible: true } : article)

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
        return action.payload.section.id == (filterSection.id || true)
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
        return action.payload.field.id == (filterField.id || true)
      }).length > 0
      if (isToggleOffField) {
        return state.map((article) => {

          const matchedFilter = (action.payload.fields.map((filterField) => {
            if ((article[`${filterField.name}`]).indexOf(action.payload.text) !== -1) {
              return true
            }
          }).filter((filterMatched) => filterMatched == true).length > 0)
    
          return (
            (matchedFilter) ?
            {...article, blockReasons: (article.blockReasons || []).filter((blockReason) => blockReason.id !== action.payload.id)} :
            article
          )
        })
      }
      return state.map((article) => {

        const matchedFilter = (action.payload.fields.map((filterField) => {
          if ((article[`${filterField.name}`]).indexOf(action.payload.text) !== -1) {
            return true
          }
        }).filter((filterMatched) => filterMatched == true).length > 0)
  
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
            })
          }
          return true
        }
      }).filter((filterMatched) => filterMatched === true).length > 0)

      if (article.blockReasons) {
        if (!!article.blockReasons.blockReasons) {
          //we'd like for this if statement (next 6 lines) to go away
          return (
            (matchedFilter) ?
            {...article, muted: true, blockReasons: article.blockReasons.blockReasons.filter((blockReason) => blockReason.id !== action.payload.id).concat(action.payload) } :
            article
          )
        }
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

  default:
      return state
  }
}

const initialState = []