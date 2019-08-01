import {
  CLASSIFIERS_ADD_CLASSIFIER,
  CLASSIFIERS_REMOVE_CLASSIFIER,
  CLASSIFIERS_TOGGLE_CLASSIFIER,
  CLASSIFIERS_LEARN_SUCCESS,
  FETCH_CLASSIFIERS_SUCCESS,
  FETCH_SAVED_CLASSIFIERS_SUCCESS
} from '../actions/classifierActions'

// import {
//   CLASSIFIER_SECTION_SELECT_SECTION
// } from '../actions/classifierSectionActions'

// import {
//   CLASSIFIER_FIELD_SELECT_FIELD
// } from '../actions/classifierFieldActions'

export default (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_APP':
      return initialState
    case FETCH_SAVED_CLASSIFIERS_SUCCESS:
      return state.map((stateClassifierItem) => {
        const overwrite = action.payload.filter((payloadClassifierItem) => payloadClassifierItem.id === stateClassifierItem.id)[0]
        return (!!overwrite) ? overwrite : stateClassifierItem
      }).concat(action.payload.filter((payloadItem) => {
        let itemExists = false
        state.map((stateItem) => {
          if (stateItem.id === payloadItem.id) {
            itemExists = true
          }
          return 'o'
        })
        return !itemExists
      }))

    case FETCH_CLASSIFIERS_SUCCESS:
      return state.concat(action.payload.filter((payloadItem) => {
        let itemExists = false
        action.payload.map((stateItem) => {
          if (stateItem.id === payloadItem.id) {
            itemExists = true
          }
          return 'o'
        })
        return !itemExists
      }))

    case CLASSIFIERS_ADD_CLASSIFIER:
      return [
        ...state.filter(classifier => classifier.id !== action.payload.id),
        action.payload
      ]
    
    case CLASSIFIERS_LEARN_SUCCESS:
      return state.map((stateClassifierItem) => {
        const overwrite = action.payload.filter((payloadClassifierItem) => payloadClassifierItem.id === stateClassifierItem.id)[0]
        return (!!overwrite) ? overwrite : stateClassifierItem
      }).concat(action.payload.filter((payloadItem) => {
        let itemExists = false
        state.map((stateItem) => {
          if (stateItem.id === payloadItem.id) {
            itemExists = true
          }
          return 'o'
        })
        return !itemExists
      }))
  

    case CLASSIFIERS_REMOVE_CLASSIFIER:
      return state.filter(stateItem => {
        let payload = Array.isArray(action.payload) ? action.payload : [action.payload]
        return payload.filter((payloadItem) => (payloadItem.id === stateItem.id)).length === 0
      })

    case CLASSIFIERS_TOGGLE_CLASSIFIER:
      return state.map(classifier => classifier.id === action.payload.id ? { ...classifier, muted: !classifier.muted || false } : classifier)

    default:
      return state
  }
}

const initialState = [{id: 'placeholder'}]
