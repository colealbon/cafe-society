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
      return state.map((filter) => {
        if (!filter.sections) {
          return Object.assign(filter, {sections: [].concat(action.payload.section)})
        }
        let deleteSection = false

        deleteSection = filter.sections.map((filterSection) => {
          if (action.payload.id == filterSection.id) {
            alert(action.payload)
            return true
          }
        })
        if (deleteSection === true) {
          return Object.assign(filter, {sections: filter.sections.filter((filterSection) => filterSection.id !==  action.payload.section.id)})
        }
        // if (action.payload.id === filter.id) {
        //   const oldSections = filter.sections
        //   const newSections = filter.sections.filter((filterSection) => filterSection.id !== action.payload.section.id)
        //   if (new Set(newSections) == new Set(oldSections)) {
        //     return Object.assign(filter)
        //   }
        //   console.log({filterBefore: Object.assign(filter, {sections: oldSections})})
        //   console.log({filterAfter: Object.assign(filter, {sections: newSections})})
        //   console.log(oldSections == newSections)
        //   if (new Set(newSections) == new Set(oldSections)) {
        //     alert(JSON.stringify({newSections: newSections, oldSections: oldSections}))
        //     filter.sections = oldSections.concat(action.payload.section)
        //     return filter
        //   }
        //   // filter.sections.map((filterSection) => {
        //   //   alert(JSON.stringify(filterSection))
        //   //   console.log(JSON.stringify({payload: action.payload}))
        //   //   console.log(JSON.stringify({filter: filter}))
        //   //   if (action.payload.id === filter.id) {
        //   //     alert(JSON.stringify(filter))
        //   //     alert(filter.id == filterSection.id)
        //   //   }
        //   //
        //   //   // if (filterSection.id == filter.id) {
        //   //   //   alert(JSON.stringify({filtersReducer: action.payload}))
        //   //   // }
        return Object.assign(filter, {sections: filter.sections.concat(action.payload.section)})
      })
    default:
      return state
  }
}
