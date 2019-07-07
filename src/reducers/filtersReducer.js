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

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SAVED_FILTERS_SUCCESS:
      return state.map((stateFilterItem) => {
        const overwrite = action.payload.filter((payloadFilterItem) => payloadFilterItem.id === stateFilterItem.id)[0]
        return overwrite ? overwrite : stateArticleItem
      })
    case FETCH_FILTERS_SUCCESS:
      return action.payload.filter((newFilter) => {
        const filterExists = state.filter((stateFilter) => stateFilter.id === newFilter.id).length !== 0
        return !(filterExists === false)
      })
    case FILTERS_ADD_FILTER:
      return [
        ...state.filter(filter => filter.id !== action.payload.id),
        action.payload
      ]
    case FILTERS_REMOVE_FILTER:
      return state.filter(filter => filter.id !== action.payload.id)

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
          return action.payload.section.id == filterSection.id
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
        if (filter.fields == []) {
          return Object.assign(filter, {fields: [action.payload.field]})
        }
        const deleteField = filter.fields.filter((field) => {
          return action.payload.field.id == field.id
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

const initialState = [
  {
    id: 'Aries',
    text: 'Aries',
    feedUrl: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675704,
    sections: [
      {
        id: 'horoscope',
        name: 'horoscope',
        muted: false
      }
    ]
  },
  {
    id: 'Taurus',
    text: 'Taurus',
    feedUrl: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675705,
    sections: [
      {
        id: 'horoscope',
        name: 'horoscope',
        muted: false
      }
    ]
  },
  {
    id: 'Gemini',
    text: 'Gemini',
    feedUrl: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675706,
    sections: [
      {
        id: 'horoscope',
        name: 'horoscope',
        muted: false
      }
    ]
  },
  {
    id: 'Cancer',
    text: 'Cancer',
    feedUrl: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675707,
    sections: [
      {
        id: 'horoscope',
        name: 'horoscope',
        muted: false
      }
    ]
  },
  {
    id: 'Virgo',
    text: 'Virgo',
    feedUrl: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675707,
    sections: [
      {
        id: 'horoscope',
        name: 'horoscope',
        muted: false
      }
    ]
  },
  {
    id: 'Libra',
    text: 'Libra',
    feedUrl: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675707,
    sections: [
      {
        id: 'horoscope',
        name: 'horoscope',
        muted: false
      }
    ]
  },
  {
    id: 'Scorpio',
    text: 'Scorpio',
    feedUrl: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675708,
    sections: [
      {
        id: 'horoscope',
        name: 'horoscope',
        muted: false
      }
    ]
  },
  {
    id: 'Sagittarius',
    text: 'Sagittarius',
    feedUrl: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675708,
    sections: [
      {
        id: 'horoscope',
        name: 'horoscope',
        muted: false
      }
    ]
  },
  {
    id: 'Capricorn',
    text: 'Capricorn',
    feedUrl: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675708,
    sections: [
      {
        id: 'horoscope',
        name: 'horoscope',
        muted: false
      }
    ]
  },
  {
    id: 'Aquarius',
    text: 'Aquarius',
    feedUrl: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675708,
    sections: [
      {
        id: 'horoscope',
        name: 'horoscope',
        muted: false
      }
    ]
  },
  {
    id: 'Pisces',
    text: 'Pisces',
    feedUrl: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675709,
    sections: [
      {
        id: 'horoscope',
        name: 'horoscope',
        muted: false
      }
    ]
  },
  {
    id: 'Car Detailer',
    text: 'Car Detailer',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427441,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'DoorDash',
    text: 'DoorDash',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427441,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: '(La Pine)',
    text: '(La Pine)',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427442,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Handyman',
    text: 'Handyman',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427442,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Guest Experience Specialist',
    text: 'Guest Experience Specialist',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427442,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Attendant',
    text: 'Attendant',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427442,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Housekeeping',
    text: 'Housekeeping',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427442,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Bend Sales Support',
    text: 'Bend Sales Support',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427442,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Delivery Driver',
    text: 'Delivery Driver',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427442,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Equipment Operator',
    text: 'Equipment Operator',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427442,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Automotive technician',
    text: 'Automotive technician',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427442,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Service Advisor',
    text: 'Service Advisor',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427442,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Customer Support',
    text: 'Customer Support',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427442,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Selectron',
    text: 'Selectron',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675713,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Content Integrity Specialist',
    text: 'Content Integrity Specialist',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777803,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Active911',
    text: 'Active911',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      },
      {
        id: 'contentSnippet',
        name: 'contentSnippet',
        muted: false
      }
    ],
    lastUsed: 1559656675714,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'OpenEye',
    text: 'OpenEye',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      },
      {
        id: 'contentSnippet',
        name: 'contentSnippet',
        muted: false
      }
    ],
    lastUsed: 1558665777804,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'PTIGlobal',
    text: 'PTIGlobal',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675715,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'track installation',
    text: 'track installation',
    feedUrl: 'https://bend.craigslist.org/search/jjj?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      },
      {
        id: 'contentSnippet',
        name: 'contentSnippet',
        muted: false
      }
    ],
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'rollingstone.comundefined',
    text: 'rollingstone.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675717
  },
  {
    id: 'tmz.comundefined',
    text: 'tmz.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675718
  },
  {
    id: 'rt.com/sporthttps://www.rt.com/rss/',
    text: 'rt.com/sport',
    feedUrl: 'https://www.rt.com/rss/',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675719
  },
  {
    id: 'Nipsey Hussle',
    text: 'Nipsey Hussle',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861856
  },
  {
    id: 'foxnews.com/entertainmenthttps://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en',
    text: 'foxnews.com/entertainment',
    feedUrl: 'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675720
  },
  {
    id: 'entertainmenthttps://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en',
    text: 'entertainment',
    feedUrl: 'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675720
  },
  {
    id: 'lonestarball.comundefined',
    text: 'lonestarball.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1557619427445
  },
  {
    id: 'cnet.comundefined',
    text: 'cnet.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675721
  },
  {
    id: 'espn.comundefined',
    text: 'espn.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675722
  },
  {
    id: 'abc13.comundefined',
    text: 'abc13.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420423
  },
  {
    id: 'Anita Hill',
    text: 'Anita Hill',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427446
  },
  {
    id: 'mlbtraderumors.comundefined',
    text: 'mlbtraderumors.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558405861858
  },
  {
    id: 'markets-this-weekundefined',
    text: 'markets-this-week',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1557619427447
  },
  {
    id: 'youtube.comundefined',
    text: 'youtube.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675724
  },
  {
    id: 'Giuliani',
    text: 'Giuliani',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675724
  },
  {
    id: 'dmagazine.comundefined',
    text: 'dmagazine.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1557619427447
  },
  {
    id: 'Bill Maher',
    text: 'Bill Maher',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420426
  },
  {
    id: 'Elon Musk',
    text: 'Elon Musk',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675725
  },
  {
    id: 'dog mauling',
    text: 'dog mauling',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427448
  },
  {
    id: '2020 Democrats',
    text: '2020 Democrats',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675725
  },
  {
    id: 'Constance Wu',
    text: 'Constance Wu',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420428
  },
  {
    id: 'stltoday.comundefined',
    text: 'stltoday.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675726
  },
  {
    id: 'Red Sox',
    text: 'Red Sox',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675726
  },
  {
    id: 'nbcsports.comundefined',
    text: 'nbcsports.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675727
  },
  {
    id: 'measles',
    text: 'measles',
    fields: [
      'title',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675727
  },
  {
    id: 'ew.comundefined',
    text: 'ew.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675728
  },
  {
    id: 'Meghan Markle',
    text: 'Meghan Markle',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675728
  },
  {
    id: 'wthr.comundefined',
    text: 'wthr.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675729
  },
  {
    id: 'Laura Lee',
    text: 'Laura Lee',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427449
  },
  {
    id: 'sports.yahoo.comhttps://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en',
    text: 'sports.yahoo.com',
    feedUrl: 'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675729
  },
  {
    id: 'Measles',
    text: 'Measles',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675731
  },
  {
    id: 'justjared.comundefined',
    text: 'justjared.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1557619427450
  },
  {
    id: 'Alyssa Milano',
    text: 'Alyssa Milano',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420435
  },
  {
    id: 'mlb.comundefined',
    text: 'mlb.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675738
  },
  {
    id: 'mauled by dog',
    text: 'mauled by dog',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427450
  },
  {
    id: '5 shot',
    text: '5 shot',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427450
  },
  {
    id: 'theathletic.comundefined',
    text: 'theathletic.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1557619427450
  },
  {
    id: 'androidpolice.comundefined',
    text: 'androidpolice.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558665777817
  },
  {
    id: 'cbssports.comundefined',
    text: 'cbssports.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675746
  },
  {
    id: 'YouTuber',
    text: 'YouTuber',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675749
  },
  {
    id: 'Jonas Brothers',
    text: 'Jonas Brothers',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427450
  },
  {
    id: 'sportsday.dallasnews.comundefined',
    text: 'sportsday.dallasnews.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1557619427451
  },
  {
    id: 'foxnews.com/politicsundefined',
    text: 'foxnews.com/politics',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675754
  },
  {
    id: 'Buttigieg',
    text: 'Buttigieg',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675754
  },
  {
    id: 'mauling',
    text: 'mauling',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427451
  },
  {
    id: 'androidpit.comundefined',
    text: 'androidpit.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1557619427451
  },
  {
    id: 'lowkickmma.comundefined',
    text: 'lowkickmma.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420454
  },
  {
    id: 'sny.tvundefined',
    text: 'sny.tv',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675757
  },
  {
    id: 'Chris Hughes',
    text: 'Chris Hughes',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427451
  },
  {
    id: 'Harvey Weinstein',
    text: 'Harvey Weinstein',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675757
  },
  {
    id: 'Falwell Jr',
    text: 'Falwell Jr',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427451
  },
  {
    id: '2020 Rival',
    text: '2020 Rival',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420457
  },
  {
    id: 'slashgear.comundefined',
    text: 'slashgear.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1557619427451
  },
  {
    id: 'techcrunch.comundefined',
    text: 'techcrunch.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675760
  },
  {
    id: 'xxlmag.comundefined',
    text: 'xxlmag.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675760
  },
  {
    id: 'digitalspy.comundefined',
    text: 'digitalspy.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1557619427452
  },
  {
    id: 'Chickenpox',
    text: 'Chickenpox',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427452
  },
  {
    id: 'androidauthority.comundefined',
    text: 'androidauthority.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420462
  },
  {
    id: 'slamonline.comundefined',
    text: 'slamonline.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420463
  },
  {
    id: 'Brainstorm Health',
    text: 'Brainstorm Health',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1557619427452
  },
  {
    id: 'bleacherreport.comundefined',
    text: 'bleacherreport.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675765
  },
  {
    id: 'kwwl.comundefined',
    text: 'kwwl.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675766
  },
  {
    id: 'larrybrownsports.comundefined',
    text: 'larrybrownsports.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675766
  },
  {
    id: 'golfchannel.comundefined',
    text: 'golfchannel.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675767
  },
  {
    id: 'nba.comundefined',
    text: 'nba.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420469
  },
  {
    id: 'Dennis Rodman',
    text: 'Dennis Rodman',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420470
  },
  {
    id: 'Kim Kardashian',
    text: 'Kim Kardashian',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675769
  },
  {
    id: 'Kanye West',
    text: 'Kanye West',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675770
  },
  {
    id: 'James Charles',
    text: 'James Charles',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420474
  },
  {
    id: 'Obituary:',
    text: 'Obituary:',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675771
  },
  {
    id: 'philly.comundefined',
    text: 'philly.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675771
  },
  {
    id: 'milesplit.comundefined',
    text: 'milesplit.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420476
  },
  {
    id: 'collectspace.comundefined',
    text: 'collectspace.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420477
  },
  {
    id: 'Silver King',
    text: 'Silver King',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420478
  },
  {
    id: 'mmr-vaccineundefined',
    text: 'mmr-vaccine',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420479
  },
  {
    id: 'hiphopdx.comundefined',
    text: 'hiphopdx.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420480
  },
  {
    id: 'Rolling Loud',
    text: 'Rolling Loud',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420481
  },
  {
    id: 'gonintendo.comundefined',
    text: 'gonintendo.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675776
  },
  {
    id: 'Manchester United',
    text: 'Manchester United',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420482
  },
  {
    id: 'abc11.comundefined',
    text: 'abc11.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420482
  },
  {
    id: 'found dead',
    text: 'found dead',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675778
  },
  {
    id: 'Avengers',
    text: 'Avengers',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675778
  },
  {
    id: 'dailycaller.comundefined',
    text: 'dailycaller.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558405861871
  },
  {
    id: 'Lakers',
    text: 'Lakers',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675779
  },
  {
    id: 'Premier League',
    text: 'Premier League',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675779
  },
  {
    id: 'Nacho Libre',
    text: 'Nacho Libre',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420486
  },
  {
    id: 'Redskin',
    text: 'Redskin',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675784
  },
  {
    id: 'Jeff Bezos',
    text: 'Jeff Bezos',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675785
  },
  {
    id: 'deadline.comundefined',
    text: 'deadline.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675786
  },
  {
    id: 'onemileatatime.comundefined',
    text: 'onemileatatime.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420488
  },
  {
    id: 'caranddriver.comundefined',
    text: 'caranddriver.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420489
  },
  {
    id: 'appleinsider.comundefined',
    text: 'appleinsider.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558665777831
  },
  {
    id: 'Padres',
    text: 'Padres',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420490
  },
  {
    id: 'empiresportsmedia.comundefined',
    text: 'empiresportsmedia.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420490
  },
  {
    id: 'bgr.comundefined',
    text: 'bgr.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675789
  },
  {
    id: 'Brucellosis',
    text: 'Brucellosis',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420492
  },
  {
    id: 'notebookcheck.netundefined',
    text: 'notebookcheck.net',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675790
  },
  {
    id: 'thurrott.comundefined',
    text: 'thurrott.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675791
  },
  {
    id: 'Game of Thrones',
    text: 'Game of Thrones',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675791
  },
  {
    id: 'Your Monday Briefing',
    text: 'Your Monday Briefing',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861874
  },
  {
    id: 'Rape Case',
    text: 'Rape Case',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420495
  },
  {
    id: 'Felicity Huffman',
    text: 'Felicity Huffman',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420495
  },
  {
    id: 'Admissions Scandal',
    text: 'Admissions Scandal',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420496
  },
  {
    id: '9to5mac.comundefined',
    text: '9to5mac.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675795
  },
  {
    id: 'zdnet.comundefined',
    text: 'zdnet.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420496
  },
  {
    id: 'heroichollywood.comundefined',
    text: 'heroichollywood.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420497
  },
  {
    id: 'Kawhi Leonard',
    text: 'Kawhi Leonard',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675796
  },
  {
    id: 'sbnation.comundefined',
    text: 'sbnation.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675797
  },
  {
    id: 'Matthew Boling',
    text: 'Matthew Boling',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420498
  },
  {
    id: 'Justin Sun',
    text: 'Justin Sun',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675798
  },
  {
    id: 'Doris Day',
    text: 'Doris Day',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420499
  },
  {
    id: 'arts/televisionhttps://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/us/rss.xml',
    text: 'arts/television',
    feedUrl: 'https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/us/rss.xml',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675799
  },
  {
    id: 'tomsguide.comundefined',
    text: 'tomsguide.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420501
  },
  {
    id: 'bleedingcool.comundefined',
    text: 'bleedingcool.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420501
  },
  {
    id: 'ign.comundefined',
    text: 'ign.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675801
  },
  {
    id: 'Cavaliers',
    text: 'Cavaliers',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420502
  },
  {
    id: 'John Beilein',
    text: 'John Beilein',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420503
  },
  {
    id: 'Manchester City',
    text: 'Manchester City',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861877
  },
  {
    id: 'Twitter',
    text: 'Twitter',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675803
  },
  {
    id: 'Data Analyst',
    text: 'Data Analyst',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777836,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'FileMaker',
    text: 'FileMaker',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420505,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'carbuzz.comundefined',
    text: 'carbuzz.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420507
  },
  {
    id: 'gizmodo.comundefined',
    text: 'gizmodo.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675806
  },
  {
    id: 'arstechnica.comundefined',
    text: 'arstechnica.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675806
  },
  {
    id: 'avclub.comundefined',
    text: 'avclub.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675807
  },
  {
    id: 'hollywoodlife.comundefined',
    text: 'hollywoodlife.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420509
  },
  {
    id: 'Maleah Davis',
    text: 'Maleah Davis',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675808
  },
  {
    id: 'Mormon church',
    text: 'Mormon church',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420510
  },
  {
    id: 'harpersbazaar.comundefined',
    text: 'harpersbazaar.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420511
  },
  {
    id: 'Uber',
    text: 'Uber',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675811,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: '6abc.comundefined',
    text: '6abc.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675811
  },
  {
    id: 'Cavs',
    text: 'Cavs',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777839
  },
  {
    id: 'whotv.comundefined',
    text: 'whotv.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420513
  },
  {
    id: 'Rashida Tlaib',
    text: 'Rashida Tlaib',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420515
  },
  {
    id: 'autoblog.comundefined',
    text: 'autoblog.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420515
  },
  {
    id: 'Buckingham Palace',
    text: 'Buckingham Palace',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420517
  },
  {
    id: 'Robert Kraft',
    text: 'Robert Kraft',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420517
  },
  {
    id: 'si.comundefined',
    text: 'si.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558665777842
  },
  {
    id: 'chiefs.comundefined',
    text: 'chiefs.com',
    fields: [
      'link',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420519
  },
  {
    id: 'vaccine',
    text: 'vaccine',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675818
  },
  {
    id: 'Stan Lee',
    text: 'Stan Lee',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675819
  },
  {
    id: 'Madonna',
    text: 'Madonna',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777844
  },
  {
    id: 'ESPN',
    text: 'ESPN',
    feedUrl: 'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675821
  },
  {
    id: 'eonline.comundefined',
    text: 'eonline.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675821
  },
  {
    id: 'Prince Harry',
    text: 'Prince Harry',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675822
  },
  {
    id: 'eurekalert.orgundefined',
    text: 'eurekalert.org',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420524
  },
  {
    id: 'Fox News',
    text: 'Fox News',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675823
  },
  {
    id: 'tysonsreporter.comundefined',
    text: 'tysonsreporter.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420525
  },
  {
    id: 'hollywoodreporter.comundefined',
    text: 'hollywoodreporter.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675824
  },
  {
    id: 'Terry Bradshaw',
    text: 'Terry Bradshaw',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420526
  },
  {
    id: 'Tiger Woods',
    text: 'Tiger Woods',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675826
  },
  {
    id: 'windowscentral.comundefined',
    text: 'windowscentral.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420527
  },
  {
    id: 'Infrastructure Consultant (Bellevue)',
    text: 'Infrastructure Consultant (Bellevue)',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861883,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Affirma Consulting',
    text: 'Affirma Consulting',
    feedUrl: 'https://seattle.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777848,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Programmer 2, Library',
    text: 'Programmer 2, Library',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861884,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Data Science Fellowship',
    text: 'Data Science Fellowship',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675830,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Pathrise',
    text: 'Pathrise',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675830,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Driving',
    text: 'Driving',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675831
  },
  {
    id: 'YouTube',
    text: 'YouTube',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675831
  },
  {
    id: 'Review:',
    text: 'Review:',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675832
  },
  {
    id: 'gamespot.comundefined',
    text: 'gamespot.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675832
  },
  {
    id: 'Amazon Echo',
    text: 'Amazon Echo',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420531
  },
  {
    id: 'Tim Conway',
    text: 'Tim Conway',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420532
  },
  {
    id: 'iPhone',
    text: 'iPhone',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675835
  },
  {
    id: 'engadget.comundefined',
    text: 'engadget.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675835
  },
  {
    id: 'awardsdaily.comundefined',
    text: 'awardsdaily.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420533
  },
  {
    id: 'Affirma',
    text: 'Affirma',
    feedUrl: 'https://seattle.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777851,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Steve Bullock',
    text: 'Steve Bullock',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420534
  },
  {
    id: 'anandtech.comundefined',
    text: 'anandtech.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675837
  },
  {
    id: 'screendaily.comundefined',
    text: 'screendaily.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675838
  },
  {
    id: 'wkrg.comundefined',
    text: 'wkrg.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420536
  },
  {
    id: 'Simulation Technician Specialist',
    text: 'Simulation Technician Specialist',
    feedUrl: 'https://seattle.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861889,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'pushsquare.comundefined',
    text: 'pushsquare.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675840
  },
  {
    id: 'droid-life.comundefined',
    text: 'droid-life.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420538
  },
  {
    id: 'destructoid.comundefined',
    text: 'destructoid.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420539
  },
  {
    id: 'Database Administrator',
    text: 'Database Administrator',
    feedUrl: 'https://seattle.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861890,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'totalprosports.comundefined',
    text: 'totalprosports.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420540
  },
  {
    id: 'boston25news.comundefined',
    text: 'boston25news.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420540
  },
  {
    id: 'GoT',
    text: 'GoT',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675845
  },
  {
    id: 'Titan Security Key',
    text: 'Titan Security Key',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420541
  },
  {
    id: 'pcgamer.comundefined',
    text: 'pcgamer.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420542
  },
  {
    id: 'Harry and Meghan',
    text: 'Harry and Meghan',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675847
  },
  {
    id: 'John Wick',
    text: 'John Wick',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861893
  },
  {
    id: 'space.comundefined',
    text: 'space.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675849
  },
  {
    id: 'dailymail.co.ukundefined',
    text: 'dailymail.co.uk',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675850
  },
  {
    id: 'npr.orgundefined',
    text: 'npr.org',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675851
  },
  {
    id: 'today.comundefined',
    text: 'today.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675852
  },
  {
    id: 'goldenstateofmind.comundefined',
    text: 'goldenstateofmind.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420545
  },
  {
    id: 'fortniteintel.comundefined',
    text: 'fortniteintel.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675852
  },
  {
    id: 'pagesix.comundefined',
    text: 'pagesix.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675853
  },
  {
    id: 'Halle Berry',
    text: 'Halle Berry',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420546
  },
  {
    id: 'NBA',
    text: 'NBA',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675854
  },
  {
    id: 'gamesradar.comundefined',
    text: 'gamesradar.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420546
  },
  {
    id: 'laineygossip.comundefined',
    text: 'laineygossip.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420547
  },
  {
    id: 'techradar.comundefined',
    text: 'techradar.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675855
  },
  {
    id: 'wtop.comundefined',
    text: 'wtop.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675856
  },
  {
    id: 'WWE',
    text: 'WWE',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861896
  },
  {
    id: 'Grumpy Cat',
    text: 'Grumpy Cat',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420548
  },
  {
    id: 'Pokémon',
    text: 'Pokémon',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420549
  },
  {
    id: 'Minecraft',
    text: 'Minecraft',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420549
  },
  {
    id: 'thenextweb.comundefined',
    text: 'thenextweb.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420550
  },
  {
    id: 'vulture.comundefined',
    text: 'vulture.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675860
  },
  {
    id: 'Ja Morant',
    text: 'Ja Morant',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675861
  },
  {
    id: 'teslarati.comundefined',
    text: 'teslarati.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675861
  },
  {
    id: 'gamasutra.comundefined',
    text: 'gamasutra.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675863
  },
  {
    id: 'Technical Writer',
    text: 'Technical Writer',
    feedUrl: 'https://seattle.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861897,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'news12.comundefined',
    text: 'news12.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675864
  },
  {
    id: 'news5cleveland.comundefined',
    text: 'news5cleveland.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420553
  },
  {
    id: 'macrumors.comundefined',
    text: 'macrumors.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675865
  },
  {
    id: 'Royal baby',
    text: 'Royal baby',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420553
  },
  {
    id: 'Knicks',
    text: 'Knicks',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675866
  },
  {
    id: 'kgun9.comundefined',
    text: 'kgun9.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420554
  },
  {
    id: 'royal baby',
    text: 'royal baby',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420554
  },
  {
    id: 'Elton John',
    text: 'Elton John',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675868
  },
  {
    id: 'instyle.comundefined',
    text: 'instyle.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558405861898
  },
  {
    id: 'kotaku.comundefined',
    text: 'kotaku.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675868
  },
  {
    id: 'ktvq.comundefined',
    text: 'ktvq.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675869
  },
  {
    id: 'Travis Tritt',
    text: 'Travis Tritt',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420556
  },
  {
    id: 'foxbaltimore.comundefined',
    text: 'foxbaltimore.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420556
  },
  {
    id: 'Pimlico',
    text: 'Pimlico',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558278420556,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'venturebeat.comundefined',
    text: 'venturebeat.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558278420557
  },
  {
    id: 'Database Development',
    text: 'Database Development',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861899,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Assassin’s Creed',
    text: 'Assassin’s Creed',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861899
  },
  {
    id: 'Rapper Future',
    text: 'Rapper Future',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861900
  },
  {
    id: 'Robert F Smith',
    text: 'Robert F Smith',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777865
  },
  {
    id: 'Robert F. Smith',
    text: 'Robert F. Smith',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861900
  },
  {
    id: 'Salem Sabatka',
    text: 'Salem Sabatka',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861900
  },
  {
    id: 'tweeting',
    text: 'tweeting',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675874
  },
  {
    id: 'American Idol',
    text: 'American Idol',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861901
  },
  {
    id: 'Laine Hardy',
    text: 'Laine Hardy',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861901
  },
  {
    id: 'JOB PLACEMENT',
    text: 'JOB PLACEMENT',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861901,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'ghacks.netundefined',
    text: 'ghacks.net',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558405861901
  },
  {
    id: 'theverge.comundefined',
    text: 'theverge.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675878
  },
  {
    id: 'Bootcamp',
    text: 'Bootcamp',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777867,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Newton Research Labs',
    text: 'Newton Research Labs',
    feedUrl: 'https://seattle.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558405861902,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Trump blasts',
    text: 'Trump blasts',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675880
  },
  {
    id: 'dallascowboys.comundefined',
    text: 'dallascowboys.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558405861903
  },
  {
    id: 'popculture.comundefined',
    text: 'popculture.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558405861903
  },
  {
    id: 'Windows 10',
    text: 'Windows 10',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675882,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Senior Ruby Developer',
    text: 'Senior Ruby Developer',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675883,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'DoD',
    text: 'DoD',
    feedUrl: 'https://sanantonio.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777869,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Account Manager',
    text: 'Account Manager',
    feedUrl: 'https://sanantonio.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777869,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Customer Care',
    text: 'Customer Care',
    feedUrl: 'https://sanantonio.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777869,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'File Processor',
    text: 'File Processor',
    feedUrl: 'https://sanantonio.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777869,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'at craigslist',
    text: 'at craigslist',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675885,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'T-SQL',
    text: 'T-SQL',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675886,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Jr. PHP',
    text: 'Jr. PHP',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675886,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Client Services',
    text: 'Client Services',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777870,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Test Lead',
    text: 'Test Lead',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777870,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Wastewater Treatment',
    text: 'Wastewater Treatment',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777870,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Vehicle Operations Specialist',
    text: 'Vehicle Operations Specialist',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675888,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Vehicle Operator',
    text: 'Vehicle Operator',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675888,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'mozilla.orgundefined',
    text: 'mozilla.org',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1558665777871
  },
  {
    id: 'Bridget Namiotka',
    text: 'Bridget Namiotka',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777872
  },
  {
    id: 'Software Engineering Fellow',
    text: 'Software Engineering Fellow',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675890,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Stranger Things',
    text: 'Stranger Things',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777872
  },
  {
    id: 'New Coke',
    text: 'New Coke',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777872
  },
  {
    id: 'Ralph Northam',
    text: 'Ralph Northam',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777873
  },
  {
    id: 'Fortnite',
    text: 'Fortnite',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675892
  },
  {
    id: 'Software Tester',
    text: 'Software Tester',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675908,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'ETL Developer',
    text: 'ETL Developer',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1558665777874,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'twinkietown.comundefined',
    text: 'twinkietown.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675909
  },
  {
    id: 'Natalie Portman',
    text: 'Natalie Portman',
    fields: [
      'contentSnippet',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675911
  },
  {
    id: 'Pope Francis',
    text: 'Pope Francis',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675912
  },
  {
    id: 'Netflix',
    text: 'Netflix',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675912
  },
  {
    id: 'Redacted Tonight',
    text: 'Redacted Tonight',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675913
  },
  {
    id: '411mania.comundefined',
    text: '411mania.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675915
  },
  {
    id: 'marketwatch.comundefined',
    text: 'marketwatch.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675916
  },
  {
    id: 'weau.comundefined',
    text: 'weau.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675916
  },
  {
    id: 'cbslocal.comundefined',
    text: 'cbslocal.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675917
  },
  {
    id: 'channel3000.comundefined',
    text: 'channel3000.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675917
  },
  {
    id: 'Office Coordinator',
    text: 'Office Coordinator',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675918,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Information Systems Analyst',
    text: 'Information Systems Analyst',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675919,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Data Processing Manager',
    text: 'Data Processing Manager',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675919,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Network Engineer',
    text: 'Network Engineer',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675920,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'TECHNOLOGY MANAGER',
    text: 'TECHNOLOGY MANAGER',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675920,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Database Consultant',
    text: 'Database Consultant',
    feedUrl: 'https://portland.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675921,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Daily Roundup',
    text: 'Daily Roundup',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675921
  },
  {
    id: 'laptopmag.comundefined',
    text: 'laptopmag.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675922
  },
  {
    id: 'dsogaming.comundefined',
    text: 'dsogaming.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675922
  },
  {
    id: 'collider.comundefined',
    text: 'collider.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675923
  },
  {
    id: 'bustle.comundefined',
    text: 'bustle.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675923
  },
  {
    id: 'MacKenzie Bezos',
    text: 'MacKenzie Bezos',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675924
  },
  {
    id: 'patriots.comundefined',
    text: 'patriots.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675924
  },
  {
    id: 'newsarama.comundefined',
    text: 'newsarama.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675925
  },
  {
    id: 'nintendoworldreport.comundefined',
    text: 'nintendoworldreport.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675926
  },
  {
    id: 'nintendolife.comundefined',
    text: 'nintendolife.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675926
  },
  {
    id: 'gearpatrol.comundefined',
    text: 'gearpatrol.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675927
  },
  {
    id: 'Chris Hemsworth',
    text: 'Chris Hemsworth',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675928
  },
  {
    id: 'criminal record',
    text: 'criminal record',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Safety Contractor',
    text: 'Safety Contractor',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675929,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Map Annotator',
    text: 'Map Annotator',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675930,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Annotation Specialist',
    text: 'Annotation Specialist',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675931,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Quality Assurance Engineer',
    text: 'Quality Assurance Engineer',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'Ashton Kutcher',
    text: 'Ashton Kutcher',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675932
  },
  {
    id: 'Paid Opinion Study',
    text: 'Paid Opinion Study',
    feedUrl: 'https://sfbay.craigslist.org/search/sof?format=rss',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675933
  },
  {
    id: 'Champions League',
    text: 'Champions League',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675933
  },
  {
    id: 'Philip Green',
    text: 'Philip Green',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675933
  },
  {
    id: 'charlieintel.comundefined',
    text: 'charlieintel.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675934
  },
  {
    id: 'wrcbtv.comundefined',
    text: 'wrcbtv.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675935
  },
  {
    id: 'Jennifer Dulos',
    text: 'Jennifer Dulos',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675936
  },
  {
    id: 'Triage Specialist',
    text: 'Triage Specialist',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675936,
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'loudwire.comundefined',
    text: 'loudwire.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675937
  },
  {
    id: 'Powerball',
    text: 'Powerball',
    fields: [
      'title',
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    lastUsed: 1559656675937
  },
  {
    id: 'phonearena.comundefined',
    text: 'phonearena.com',
    fields: [
      'link',
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    lastUsed: 1559656675939
  },
  {
    id: 'map-annotator',
    text: 'Map Annotator',
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ],
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ]
  },
  {
    id: 'r&d-test operator',
    text: 'R&D Test Operator',
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ]
  },
  {
    id: 'summer',
    text: 'Summer',
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'training',
    text: 'training',
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'driver',
    text: 'Driver',
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ],
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ]
  },
  {
    id: 'pathrise',
    text: 'Pathrise',
    fields: [
      {
        id: 'contentSnippet',
        name: 'contentSnippet',
        muted: false
      }
    ],
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'upwardly',
    text: 'Upwardly',
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ],
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      },
      {
        id: 'contentSnippet',
        name: 'contentSnippet',
        muted: false
      }
    ]
  },
  {
    id: 'support-technician',
    text: 'Support Technician',
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ],
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ]
  },
  {
    id: 'software-configuration manager',
    text: 'Software Configuration Manager',
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ],
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'county-court',
    text: 'County Court',
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ],
    fields: [
      {
        id: 'contentSnippet',
        name: 'contentSnippet',
        muted: false
      }
    ]
  },
  {
    id: 'placeholder',
    text: 'placeholder',
    fields: [
      'title'
    ],
    muted: false
  },
  {
    id: 'tennis.com',
    text: 'tennis.com',
    fields: [
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    muted: false
  },
  {
    id: 'pcper.com',
    text: 'pcper.com',
    fields: [
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    muted: false
  },
  {
    id: 'philadelphiaeagles.com',
    text: 'philadelphiaeagles.com',
    fields: [
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    muted: false
  },
  {
    id: 'espn',
    text: 'ESPN',
    fields: [
      {
        id: 'contentSnippet',
        name: 'contentSnippet',
        muted: false
      }
    ]
  },
  {
    id: 'thewrap.com',
    text: 'thewrap.com',
    fields: [
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    muted: false
  },
  {
    id: 'your-friday briefing',
    text: 'Your Friday Briefing',
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ]
  },
  {
    id: 'granger-smith',
    text: 'Granger Smith',
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ]
  },
  {
    id: 'mmajunkie.com',
    text: 'mmajunkie.com',
    fields: [
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    muted: false
  },
  {
    id: 'theinventory.com',
    text: 'theinventory.com',
    fields: [
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    muted: false
  },
  {
    id: 'kinja.com',
    text: 'kinja.com',
    fields: [
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    muted: false
  },
  {
    id: 'mmafighting.com',
    text: 'mmafighting.com',
    fields: [
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    muted: false
  },
  {
    id: 'dental-education software',
    text: 'dental education software',
    fields: [
      {
        id: 'contentSnippet',
        name: 'contentSnippet',
        muted: false
      }
    ],
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ]
  },
  {
    id: 'salesforce-specialist',
    text: 'Salesforce Specialist',
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ],
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ]
  },
  {
    id: 'stadia',
    text: 'Stadia',
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ]
  },
  {
    id: 'columbine',
    text: 'Columbine',
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ]
  },
  {
    id: 'test-technician',
    text: 'Test Technician',
    sections: [
      {
        id: 'classifieds',
        name: 'classifieds'
      }
    ],
    fields: [
      {
        id: 'title',
        name: 'title',
        muted: false
      }
    ]
  },
  {
    id: 'perezhilton.com',
    text: 'perezhilton.com',
    fields: [
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    muted: false
  },
  {
    id: 'talkingchop.com',
    text: 'talkingchop.com',
    fields: [
      {
        id: 'link',
        name: 'link',
        muted: false
      }
    ],
    muted: false
  }
]
