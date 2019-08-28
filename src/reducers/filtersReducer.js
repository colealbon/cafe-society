import {
  FILTERS_ADD_FILTER,
  FILTERS_REMOVE_FILTER,
  FILTERS_TOGGLE_FILTER,
  FETCH_FILTERS_SUCCESS,
  FETCH_SAVED_FILTERS_SUCCESS
} from '../actions/filterActions'

import {
  FILTER_SECTION_SELECT_SECTION
} from '../actions/filterSectionActions'

import {
  FILTER_FIELD_SELECT_FIELD
} from '../actions/filterFieldActions'

const initialState = [
  {
    id: 'placeholder',
    text: 'placeholder',
    fields: [{id: 'title', name:'title', muted: true}],
    muted: false
  }
]

export default (state = initialState, action) => {
  switch (action.type) {

    case 'RESET_APP':
      return initialState

    case FETCH_SAVED_FILTERS_SUCCESS:
      return [].concat(action.payload)

    case FETCH_FILTERS_SUCCESS:
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

    case FILTERS_ADD_FILTER:
      return [
        ...state.filter(filter => filter.id !== action.payload.id),
        action.payload
      ]

    case FILTERS_REMOVE_FILTER:
      return state.filter(stateItem => {
        let payload = Array.isArray(action.payload) ? action.payload : [action.payload]
        return payload.filter((payloadItem) => (payloadItem.id === stateItem.id)).length === 0
      })

    case FILTERS_TOGGLE_FILTER:
      return state.map(filter => filter.id === action.payload.id ? { ...filter, muted: !filter.muted || false } : filter)

      
    case FILTER_SECTION_SELECT_SECTION:
      // each filter has an optional list of sections
      // clicking on a section inside a filter will turn the section on or off
      // this logic figures out current filter sections and does what it must
      // good place to introduce jest tests and refactor
      return state.map((filter) => {
        if (filter.id !== action.payload.id) {
          return filter
        }
        if (!filter.sections) {
          return Object.assign({sections: [action.payload.section]}, filter)
        }
        if ([].concat(filter.sections).length === 0) {
          return {...filter, sections: [action.payload.section]}
        }
        
        const deleteSection = (filter.sections || []).filter((filterSection) => {
          return action.payload.section.id === filterSection.id
        }).length !== 0
        
        if (deleteSection) {
          return {...filter, sections: filter.sections.filter((sectionItem) => sectionItem.id !== action.payload.section.id)}
        }
        return {...filter, sections: filter.sections.concat(action.payload.section)}
      })

    case FILTER_FIELD_SELECT_FIELD:
      // each filter has an optional list of fields
      // clicking on a field inside a filter will turn the field on or off
      // this logic figures out current filter fields and does what it must
      // good place to introduce jest tests and refactor
      return state.map((filter) => {
        // alert(JSON.stringify(action.payload))
        // {"filterField":{"id":"title","name":"title","muted":false},"id":"Meow Mix","text":"Meow Mix","muted":false}
        if (filter.id !== action.payload.id) {
          return filter
        }
        if (!filter.fields) {
          return Object.assign(filter, {fields: [action.payload.field]})
        }
        if (filter.fields === []) {
          return Object.assign(filter, {fields: [action.payload.field]})
        }
        const deleteField = filter.fields.filter((field) => {
          return action.payload.field.id === field.id
        })
        if (deleteField.length < 1) {
          return Object.assign(filter, {fields: filter.fields.concat(action.payload.field)})
        }
        filter.fields = Object.assign(filter.fields.filter((field) => {
          return (action.payload.field.id !== field.id)
        }))
        return filter
      })
    default:
      return state
  }
}
