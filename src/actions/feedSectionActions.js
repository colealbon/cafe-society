import  {publishFeeds} from './feedActions'
export const FEED_SECTION_SELECT_SECTION = 'FEED_SECTION_SELECT_SECTION'

export const selectFeedSection = (feedSection, feeds) => {
  return (dispatch) => {
    dispatch({
      type: FEED_SECTION_SELECT_SECTION,
      payload: feedSection
    })
    dispatch(publishFeeds( 
      // each feed has an optional list of sections
      // clicking on a section inside a feed will turn the section on or off
      // this logic figures out current feed sections and does what it must
      // good place to introduce jest tests and refactor
      feeds.map((feedItem) => {
        if (feedItem.id !== feedSection.id) {
          return feedItem
        }
        if (!feedItem.sections) {
          return Object.assign(feedItem, {sections: [feedSection.section]})
        }
        if (feedItem.sections === []) {
          return Object.assign(feedItem, {sections: [feedSection.section]})
        }
        const deleteSection = (feedItem.sections || []).filter((feedSectionItem) => {
          return feedSection.section.id === feedSectionItem.id
        })

        if (deleteSection === undefined || deleteSection.length === 0) {
          return Object.assign(feedItem, {sections: feedItem.sections.concat(feedSection.section)})
        }
        return {sections: feedItem.sections.filter((feedSectionItem) => {
          return (feedSection.section.id !== feedSectionItem.id)
        }), ...feedItem}
      })
    ))
  }
}
