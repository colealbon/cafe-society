import {
  FEEDS_ADD_FEED,
  FEEDS_REMOVE_FEED,
  FEEDS_TOGGLE_FEED,
  FETCH_FEEDS_SUCCESS
} from '../actions/feedActions'

import {
  FEED_SECTION_SELECT_SECTION
} from '../actions/feedSectionActions'


const initialState = [
  {id: 'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en', url: 'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en', muted: false}
]

export default (state = initialState, action) => {
  switch (action.type) {
    case FEEDS_ADD_FEED:
      return [
        ...state.filter(feed => feed.id !== action.payload.id),
        action.payload
      ]
    case FEEDS_REMOVE_FEED:
      return state
        .filter(feed => feed.id !== action.payload.id)

    case FEEDS_TOGGLE_FEED:
      return state.map(feed => feed.id === action.payload.id ? { ...feed, muted: !feed.muted || false } : feed)

    case FEED_SECTION_SELECT_SECTION:
      // each feed has an optional list of sections
      // clicking on a section inside a feed will turn the section on or off
      // this logic figures out current feed sections and does what it must
      // good place to introduce jest tests and refactor
      return state.map((feed) => {
        if (feed.id !== action.payload.id) {
          return feed
        }
        if (!feed.sections) {
          return Object.assign(feed, {sections: [action.payload.section]})
        }
        if (feed.sections == []) {
          return Object.assign(feed, {sections: [action.payload.section]})
        }
        const deleteSection = feed.sections.filter((feedSection) => {
          return action.payload.section.id == feedSection.id
        })
        if (deleteSection.length < 1) {
          return Object.assign(feed, {sections: feed.sections.concat(action.payload.section)})
        }
        feed.sections = Object.assign(feed.sections.filter((feedSection) => {
          return (action.payload.section.id !== feedSection.id)
        }))
        return feed
        })

    case FETCH_FEEDS_SUCCESS:
      return action.payload

    default:
      return state
  }
}
