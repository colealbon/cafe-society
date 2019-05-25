import {
    FEEDS_ADD_FEED,
    FEEDS_REMOVE_FEED,
    FEEDS_TOGGLE_FEED
} from '../actions/feedActions'


const initialState = [
    {id:'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en', url: 'https://news.google.com/_/rss?hl=en-US&gl=US&ceid=US:en', muted:true}
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
        .filter(feed => feed.id !== action.payload.id);

      case FEEDS_TOGGLE_FEED:
        return state.map(feed => feed.id === action.payload.id ? { ...feed, muted: !feed.muted || false } : feed )

      default:
          return state
    }
  }
