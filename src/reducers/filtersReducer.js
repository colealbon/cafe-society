import {
  FILTERS_ADD_FILTER,
  FILTERS_REMOVE_FILTER,
  FILTERS_TOGGLE_FILTER,
} from '../actions/filterActions'

import {
  FILTER_SECTION_SELECT_SECTION
} from '../actions/filterSectionActions'

const initialState = [
  {id: 'Meow Mix', text: 'Meow Mix', muted: true}
]

export default (state = initialState, action) => {
  switch (action.type) {
    case FILTERS_ADD_FILTER:
      return [
        ...state.filter(filter => filter.id !== action.payload.id),
        action.payload
      ]
    case FILTERS_REMOVE_FILTER:
      return state
        .filter(filter => filter.id !== action.payload.id)

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
          return Object.assign(filter, {sections: [action.payload.section]})
        }
        if (filter.sections == []) {
          return Object.assign(filter, {sections: [action.payload.section]})
        }
        const deleteSection = filter.sections.filter((filterSection) => {
          return action.payload.section.id == filterSection.id
        })
        if (deleteSection.length < 1) {
          return Object.assign(filter, {sections: filter.sections.concat(action.payload.section)})
        }
        filter.sections = Object.assign(filter.sections.filter((filterSection) => {
          return (action.payload.section.id !== filterSection.id)
        }))
        return filter
      })
    default:
      return state
  }
}
