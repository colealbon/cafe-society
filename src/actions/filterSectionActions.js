import  {publishFilters} from './filterActions'
export const FILTER_SECTION_SELECT_SECTION = 'FILTER_SECTION_SELECT_SECTION'

export const selectFilterSection = (filterSection, filters) => {
  return (dispatch) => {
    dispatch({
      type: FILTER_SECTION_SELECT_SECTION,
      payload: filterSection
    })

    dispatch(publishFilters( // each filter has an optional list of sections
      // clicking on a section inside a filter will turn the section on or off
      // this logic figures out current filter sections and does what it must
      // good place to introduce jest tests and refactor
      filters.map((filterItem) => {
        if (filterItem.id !== filterSection.id) {
          return filterItem
        }
        if (!filterItem.sections) {
          return Object.assign(filterItem, {sections: [filterSection.section]})
        }
        if (filterItem.sections === []) {
          return Object.assign(filterItem, {sections: [filterSection.section]})
        }
        const deleteSection = (filterItem.sections || []).filter((filterSectionItem) => {
          return filterSection.section.id === filterSectionItem.id
        })
        if (deleteSection.length < 1) {
          return Object.assign(filterItem, {sections: filterItem.sections.concat(filterSection.section)})
        }
        filterItem.sections = Object.assign((filterItem.sections || []).filter((filterSectionItem) => {
          return (filterSection.section.id !== filterSectionItem.id)
        }))
        return filterItem
      })
    ))
  }
}
