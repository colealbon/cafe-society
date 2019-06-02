import {
    ARTICLES_ADD_ARTICLE,
    ARTICLES_REMOVE_ARTICLE,
    ARTICLES_TOGGLE_ARTICLE,
    FETCH_ARTICLES_SUCCESS
} from '../actions/articleActions'

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_ARTICLES_SUCCESS:
      return action.payload

    case ARTICLES_ADD_ARTICLE:
      return [
        ...state,
        {
          id: action.payload.id,
          url: action.payload.url
        }
      ]
    case ARTICLES_REMOVE_ARTICLE:
      return state
      .filter(article => article.id !== action.payload.id);

    case ARTICLES_TOGGLE_ARTICLE:
      return state.map(article => article.id === action.payload.id ? { ...article, muted: !article.muted || false } : article )

    default:
        return state
  }
}
