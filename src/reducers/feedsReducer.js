import {
  FEEDS_ADD_FEED,
  FETCH_SAVED_FEEDS_SUCCESS,
  FEEDS_REMOVE_FEED,
  FEEDS_TOGGLE_FEED,
  FETCH_FEEDS_SUCCESS
} from '../actions/feedActions'
  
import {
  FEED_SECTION_SELECT_SECTION
} from '../actions/feedSectionActions'

export default (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_APP':
      return initialState
        
    case FETCH_SAVED_FEEDS_SUCCESS:
      return [].concat(action.payload)

    case FETCH_FEEDS_SUCCESS:
      return state.filter((stateItem) => !Array.isArray(stateItem)).concat(action.payload.filter((payloadItem) => {
        let itemExists = false
        state.map((stateItem) => {
          if (stateItem.id === payloadItem.id) {
            itemExists = true
          }
          return 'o'
        })
        return !itemExists
      }))

    case FEEDS_ADD_FEED:
      return [
        ...state
        .filter((stateItem) => !Array.isArray(stateItem)).filter(feed => feed.id !== action.payload.id),
        action.payload
      ]

    case FEEDS_REMOVE_FEED:
      return state.filter(stateItem => {
        let payload = Array.isArray(action.payload) ? action.payload : [action.payload]
        return payload.filter((payloadItem) => (payloadItem.id === stateItem.id)).length === 0
      })

    case FEEDS_TOGGLE_FEED:
      return state.map(feed => feed.id === action.payload.feed.id ? { ...feed, muted: !feed.muted || false } : feed)

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
        if (feed.sections === []) {
          return Object.assign(feed, {sections: [action.payload.section]})
        }
        const deleteSection = feed.sections.filter((feedSection) => {
          return action.payload.section.id === feedSection.id
        })
        if (deleteSection.length < 1) {
          return Object.assign(feed, {sections: feed.sections.concat(action.payload.section)})
        }
        feed.sections = feed.sections.filter((feedSection) => {
          return (action.payload.section.id !== feedSection.id)
        })

        return {sections: feed.sections.filter((feedSection) => {
          return (action.payload.section.id !== feedSection.id)
        }), ...feed}
        })
    default:
      return state
  }
}
const initialState = [
  {
    id: 'https://www.scmp.com/rss/5/feed',
    url: 'https://www.scmp.com/rss/5/feed',
    sections: [
      {
        id: 'world',
        name: 'world'
      }
    ],
    muted: false
  },
  {
    id: 'https://www.scmp.com/rss/91/feed',
    url: 'https://www.scmp.com/rss/91/feed',
    sections: [
      {
        id: 'world',
        name: 'world'
      }
    ],
    muted: true
  },
  {
    id: 'https://www.ft.com/?format=rss',
    url: 'https://www.ft.com/?format=rss',
    sections: [
      {
        id: 'business',
        name: 'business'
      }
    ],
    muted: true
  },
  {
    id: 'https://www.rt.com/rss/',
    url: 'https://www.rt.com/rss/',
    sections: [
      {
        id: 'world',
        name: 'world'
      }
    ],
    muted: true
  },
  {
    id: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    sections: [
      {
        id: 'world',
        name: 'world'
      }
    ],
    muted: false
  },
  {
    id: 'https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/us/rss.xml',
    url: 'https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/us/rss.xml'
  },
  {
    id: 'https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml',
    url: 'https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml',
    sections: [
      {
        id: 'world',
        name: 'world'
      }
    ],
    muted: false
  },
  {
    id: 'https://theintercept.com/feed/?lang=en',
    url: 'https://theintercept.com/feed/?lang=en',
    sections: [
      {
        id: 'politics',
        name: 'politics',
        muted: true
      }
    ],
    muted: true
  },
  {
    id: 'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en',
    url: 'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en'
  },
  {
    id: 'https://www.statnews.com/feed/',
    url: 'https://www.statnews.com/feed/',
    sections: [
      {
        id: 'technology',
        name: 'technology'
      }
    ],
    muted: false
  },
  {
    id: 'https://lifehacker.com/rss',
    url: 'https://lifehacker.com/rss',
    sections: [
      {
        id: 'variety',
        name: 'variety'
      }
    ],
    muted: false
  },
  {
  id: 'https://www.coindesk.com/feed',
  url: 'https://www.coindesk.com/feed',
  sections: [
    {
      id: 'business',
      name: 'business'
    }
  ],
  muted: false
  }
]