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
      return state.filter((stateItem) => !Array.isArray(stateItem))
      .map((stateItem) => {
        const overwrite = action.payload.filter((payloadItem) => payloadItem.id === stateItem.id)[0]
        return (!!overwrite) ? overwrite : stateItem
      }).concat(action.payload.filter((payloadItem) => {
        let itemExists = false
        state.map((stateItem) => {
          if (stateItem.id === payloadItem.id) {
            itemExists = true
          }
        })
        return !itemExists
      }))

    case FETCH_FEEDS_SUCCESS:
      state.filter((stateItem) => !Array.isArray(stateItem))
      .concat(action.payload.filter((payloadItem) => {
        let itemExists = false
        state.map((stateItem) => {
          if (stateItem.id === payloadItem.id) {
            itemExists = true
          }
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
    default:
      return state
  }
}
const initialState = [
  {
    id: 'https://darkstarastrology.com/feed/',
    url: 'https://darkstarastrology.com/feed/',
    muted: false,
    sections: [
      {
        id: 'horoscope',
        name: 'horoscope',
        muted: false
      }
    ]
  },
  {
    id: '1b6f5c25-e3a0-437f-ac80-70e77151ed19',
    url: 'https://bend.craigslist.org/search/jjj?format=rss',
    muted: true,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'https://portland.craigslist.org/search/sof?format=rss',
    url: 'https://portland.craigslist.org/search/sof?format=rss',
    muted: true,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'https://phoenix.craigslist.org/search/sof?format=rss',
    url: 'https://phoenix.craigslist.org/search/sof?format=rss',
    muted: true,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'https://seattle.craigslist.org/search/sof?format=rss',
    url: 'https://seattle.craigslist.org/search/sof?format=rss',
    muted: true,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'https://newyork.craigslist.org/search/sof?format=rss',
    url: 'https://newyork.craigslist.org/search/sof?format=rss',
    muted: true,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'https://sanantonio.craigslist.org/search/sof?format=rss',
    url: 'https://sanantonio.craigslist.org/search/sof?format=rss',
    muted: true,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'https://bend.craigslist.org/search/sof?format=rss',
    url: 'https://bend.craigslist.org/search/sof?format=rss',
    muted: true,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'foreignpolicy.com/feed',
    url: 'foreignpolicy.com/feed',
    muted: true
  },
  {
    id: 'https://consortiumnews.com/feed/',
    url: 'https://consortiumnews.com/feed/',
    muted: true,
    sections: [
      {
        id: 'politics',
        name: 'politics'
      }
    ]
  },
  {
    id: 'http://original.antiwar.com/feed/',
    url: 'http://original.antiwar.com/feed/',
    sections: [
      {
        id: 'politics',
        name: 'politics',
        muted: true
      }
    ]
  },
  {
    id: 'https://www.blackagendareport.com/feeds-story',
    url: 'https://www.blackagendareport.com/feeds-story',
    sections: [
      {
        id: 'politics',
        name: 'politics',
        muted: true
      }
    ]
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
  },
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
    id: 'http://www.thesmartestcontract.com/rss',
    url: 'http://www.thesmartestcontract.com/rss',
    muted: true
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
    muted: true
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
  }
]