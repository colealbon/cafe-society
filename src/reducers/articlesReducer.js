import {
  ARTICLES_REMOVE_ARTICLE,
  ARTICLES_TOGGLE_ARTICLE,
  FETCH_ARTICLES_SUCCESS,
  FETCH_SAVED_ARTICLES_SUCCESS,
  ARTICLES_MARK_READ
} from '../actions/articleActions'

import {
  SECTION_SELECT_SECTION
} from '../actions/sectionActions'

import {
  FILTERS_ADD_FILTER,
  FILTERS_REMOVE_FILTER,
  FILTERS_TOGGLE_FILTER
} from '../actions/filterActions'

import {
  FILTER_SECTION_SELECT_SECTION
} from '../actions/filterSectionActions'

import {
  FILTER_FIELD_SELECT_FIELD
} from '../actions/filterFieldActions'
import { stringify } from 'querystring';

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_SAVED_ARTICLES_SUCCESS:
      // selectively overwrite article cache with blockstack version
      return state.map((stateArticleItem) => {
        const overwrite = action.payload.filter((payloadArticleItem) => payloadArticleItem.id === stateArticleItem.id)[0]
        return (!!overwrite) ? overwrite : stateArticleItem
      }).concat((action.payload).filter((payloadItem) => {
        let itemExists = false
        state.map((stateItem) => {
          if (stateItem.id === payloadItem.id) {
            itemExists = true
          }
        })
        return !itemExists
      }))

    case FETCH_ARTICLES_SUCCESS:
      const newArticles = action.payload.articles.filter((newArticle) => {
        const articleExists = state.filter((stateArticle) => stateArticle.id === newArticle.id).length !== 0
        return !articleExists
      }).map((articleItem) => {
        const blockReasons = action.payload.filters.filter((filterItem) => {
          if ((filterItem.fields || []).length == 0) {
            return [...action.payload.articles].filter((articleField) => {
              if (!!action.payload.articles[`${articleField}`]) {
                return (action.payload.articles[`${articleField}`].indexOf(filterItem.text) !== -1)
              }
            }).length !== 0
          }
          return filterItem.fields.filter((filterField) => {
            if (!!articleItem[`${filterField}`]) {
              if ((filterItem.sections || []).length !== 0) {
                return (articleItem[`${filterField}`].indexOf(filterItem.text) !== -1)
              }
              (filterItem.sections || []).map((filterSection) => {
                if (!!articleItem.feed) {
                  if (!!articleItem.feed.sections) {
                    articleItem.feed.sections.map((articleSection) => {
                      if (filterSection.id === articleSection.id) {
                        return (action.payload[`${filterField}`].indexOf(filterItem.text) !== -1)
                      }
                    })
                  }
                }
              })
            }
          }).length !== 0
        })
      if ((blockReasons || []).length !== 0) {
        return {...articleItem, blockReasons: {blockReasons}}
      }
      return articleItem
    })
    return state.concat(newArticles)

    case ARTICLES_MARK_READ:
      return state.map(stateItem => {
        let payload = Array.isArray(action.payload) ? action.payload : [action.payload]
        let muteArticle = payload.filter((payloadItem) => (payloadItem.id === stateItem.id)).length !== 0
        return (muteArticle === true) ? { ...stateItem, muted: true} : stateItem
      })

    case ARTICLES_REMOVE_ARTICLE:
      return state.filter(stateItem => {
        let payload = Array.isArray(action.payload) ? action.payload : [action.payload]
        return payload.filter((payloadItem) => (payloadItem.id === stateItem.id)).length === 0
      })

    case ARTICLES_TOGGLE_ARTICLE:
      return state.map(article => article.id === action.payload.id ? { ...article, muted: !article.muted || false } : article )

    case "@@router/LOCATION_CHANGE":
      return state.map(article => action.payload.location.pathname === "/" ? { ...article, visible: true } : article)

    case SECTION_SELECT_SECTION:
      return state.map(article => {
        if ((article.feed || []).length < 1) {
          return { ...article, visible: false }
        }
        if ((article.feed.sections || []).length < 1) {
          return { ...article, visible: false }
        }
        let matchedSection = (article.feed.sections || []).map((section) => {
          return action.payload.name === section.name
        }).filter((matchedSection) => matchedSection === true)
        return  (matchedSection || []).length > 0  ?  { ...article, visible: true } : { ...article, visible: false } 
      })

    case FILTER_SECTION_SELECT_SECTION:
      const isToggleOff = [].concat(action.payload.sections).filter((filterSection) => {
        if (filterSection === undefined) {
          return false
        }
        return action.payload.section.id == (filterSection.id || true)
      }).length > 0

      if (!!action.payload.muted) {
        return state
      }

      if (isToggleOff) {
        return state.map((article) => {     
          let newBlockReasons = (article.blockReasons || []).filter((blockReason) => blockReason.id !== action.payload.id)
          let articleMuted = newBlockReasons.length > 0
          return ({...article, muted: articleMuted, blockReasons: newBlockReasons })
        })
      }

      return state.map((article) => {
        const matchedFilter = (action.payload.fields.filter((fieldItem) => !!fieldItem.name)
          .map((filterField) => {
          if ((article[`${filterField.name}`]).indexOf(action.payload.text) !== -1) {
            if (article.feed.sections === undefined) {
              return true
            } else {
              article.feed.sections.map((feedSection) => {
                if (feedSection === undefined) {
                  return false
                }
                if (action.payload.section === undefined) {
                  return false
                }
                if ((feedSection.id || action.payload.section.id) === action.payload.section.id) {
                  return true
                }
                return false
              })
            }
          }
        }).filter((filterMatched) => filterMatched === true).length > 0)
        return (
          (matchedFilter) ?
          {...article, muted: true , blockReasons: (article.blockReasons || []).filter((blockReason) => blockReason.id !== action.payload.id).concat(action.payload)} :
          article
        )
      })

    case FILTER_FIELD_SELECT_FIELD:

      const isToggleOffField = [].concat(action.payload.fields).filter((filterField) => {
        if (filterField === undefined) {
          return false
        }
        return action.payload.field.id == (filterField.id || true)
      }).length > 0
      if (isToggleOffField) {
        return state.map((article) => {

          const matchedFilter = (action.payload.fields.map((filterField) => {
            if ((article[`${filterField.name}`]).indexOf(action.payload.text) !== -1) {
              return true
            }
          }).filter((filterMatched) => filterMatched == true).length > 0)
    
          return (
            (matchedFilter) ?
            {...article, blockReasons: (article.blockReasons || []).filter((blockReason) => blockReason.id !== action.payload.id)} :
            article
          )
        })
      }
      return state.map((article) => {

        const matchedFilter = (action.payload.fields.map((filterField) => {
          if ((article[`${filterField.name}`]).indexOf(action.payload.text) !== -1) {
            return true
          }
        }).filter((filterMatched) => filterMatched == true).length > 0)
  
        return (
          (matchedFilter) ?
          {...article, blockReasons: (article.blockReasons || []).filter((blockReason) => blockReason.id !== action.payload.id).concat(action.payload)} :
          article
        )
      })

  case FILTERS_ADD_FILTER:
    if (action.payload.id === '') {
      return state
    }
    if (!action.payload.fields) {
      return state
    }
    if (!!action.payload.muted) {
      return state
    }
    return state.map((article) => {
      const matchedFilter = (action.payload.fields.map((filterField) => {
        if ((article[`${filterField.name}`]).indexOf(action.payload.text) !== -1) {
          if (article.feed.sections === undefined) {
            return true
          } else {
            article.feed.sections.map((feedSection) => {
              if (feedSection === undefined) {
                return true
              }
              if (action.payload.section === undefined) {
                return true
              }
              if ((feedSection.id ||  action.payload.section.id) === action.payload.section.id) {
                return true
              }
            })
          }
          return true
        }
      }).filter((filterMatched) => filterMatched === true).length > 0)
      if (article.blockReasons) {
        if (!!article.blockReasons.blockReasons) {
          //we'd like for this if statement (next 6 lines) to go away
          return (
            (matchedFilter) ?
            {...article, muted: true, blockReasons: article.blockReasons.blockReasons.filter((blockReason) => blockReason.id !== action.payload.id).concat(action.payload) } :
            article
          )
        }
        return (
          (matchedFilter) ?
          {...article, muted: true, blockReasons: article.blockReasons.filter((blockReason) => blockReason.id !== action.payload.id).concat(action.payload) } :
          article
        )
      }
      return (
        (matchedFilter) ?
        {...article, muted: true, blockReasons: [action.payload] } :
        article
      )

  })  

  default:
      return state
  }
}

const initialState = [
    {
      id: 'https://horoscope.findyourfate.com/ariesdailyhoroscope.html',
      feed: {
        id: '5b802fc8-7fe0-4e27-954d-0b6ea01d0065',
        url: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
        muted: false,
        sections: [
          {
            id: 'horoscope',
            name: 'horoscope',
            muted: false
          }
        ]
      },
      title: 'Aries Horoscope for Tuesday, June 11, 2019',
      link: 'https://horoscope.findyourfate.com/ariesdailyhoroscope.html',
      content: 'What a break that was! You can`t believe that it`s actually over, but here you are staring another opportunity  in the face. Your life is moving at a slower pace and the flow of time turns into a drop-by-drop trickle. Make this phenomenon work to your advantage. If there`s some way to catch up and get ahead, do it. All you need to do is fight off that overwhelming desire to go back to bed. Any preparations that you can make now will be like money in the bank once you`re back on your game again.',
      contentSnippet: 'What a break that was! You can`t believe that it`s actually over, but here you are staring another opportunity  in the face. Your life is moving at a slower pace and the flow of time turns into a drop-by-drop trickle. Make this phenomenon work to your advantage. If there`s some way to catch up and get ahead, do it. All you need to do is fight off that overwhelming desire to go back to bed. Any preparations that you can make now will be like money in the bank once you`re back on your game again.',
      muted: false
    },
    {
      id: 'https://horoscope.findyourfate.com/taurusdailyhoroscope.html',
      feed: {
        id: '5b802fc8-7fe0-4e27-954d-0b6ea01d0065',
        url: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
        muted: false,
        sections: [
          {
            id: 'horoscope',
            name: 'horoscope',
            muted: false
          }
        ]
      },
      title: 'Taurus Horoscope for Tuesday, June 11, 2019',
      link: 'https://horoscope.findyourfate.com/taurusdailyhoroscope.html',
      content: 'Dare to speak out and step out. Say what must be said. Go where you need to go. Boldness and bravery are the keys to your success. Stand tall and carry your load proudly. The world has turned again and the Stars are lining up for your benefit. Now you`re the master of your own destiny and probably that of anyone else who feels ready to sign on. Dreams translate into actions. Actors get real. Vapor rises and solidifies, giving you a firm new platform from which to survey your entire domain.',
      contentSnippet: 'Dare to speak out and step out. Say what must be said. Go where you need to go. Boldness and bravery are the keys to your success. Stand tall and carry your load proudly. The world has turned again and the Stars are lining up for your benefit. Now you`re the master of your own destiny and probably that of anyone else who feels ready to sign on. Dreams translate into actions. Actors get real. Vapor rises and solidifies, giving you a firm new platform from which to survey your entire domain.',
      muted: false
    },
    {
      id: 'https://horoscope.findyourfate.com/geminidailyhoroscope.html',
      feed: {
        id: '5b802fc8-7fe0-4e27-954d-0b6ea01d0065',
        url: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
        muted: false,
        sections: [
          {
            id: 'horoscope',
            name: 'horoscope',
            muted: false
          }
        ]
      },
      title: 'Gemini Horoscope for Tuesday, June 11, 2019',
      link: 'https://horoscope.findyourfate.com/geminidailyhoroscope.html',
      content: 'This is your moment to speak in code or break other people`s codes. Under the veneer of happy talk and pretty pictures, nothing is what it seems. Use the spaces between words to transmit the real meaning of what you`re saying. Anyone perceptive enough to pick up on this is either your best friend or a formidable adversary. Difficult projects require winning strategies for those who dare to take them on. Good intentions don`t count for much until you make a major investment in the hardware that can turn dreams into reality. Read the manual before operating the equipment.',
      contentSnippet: 'This is your moment to speak in code or break other people`s codes. Under the veneer of happy talk and pretty pictures, nothing is what it seems. Use the spaces between words to transmit the real meaning of what you`re saying. Anyone perceptive enough to pick up on this is either your best friend or a formidable adversary. Difficult projects require winning strategies for those who dare to take them on. Good intentions don`t count for much until you make a major investment in the hardware that can turn dreams into reality. Read the manual before operating the equipment.',
      muted: false
    },
    {
      id: 'https://horoscope.findyourfate.com/cancerdailyhoroscope.html',
      feed: {
        id: '5b802fc8-7fe0-4e27-954d-0b6ea01d0065',
        url: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
        muted: false,
        sections: [
          {
            id: 'horoscope',
            name: 'horoscope',
            muted: false
          }
        ]
      },
      title: 'Cancer Horoscope for Tuesday, June 11, 2019',
      link: 'https://horoscope.findyourfate.com/cancerdailyhoroscope.html',
      content: 'Outsiders have their perspective, although it`s hard for them to play a hands-on game. Things are different for you this time. Through careful planning, good connections or just a twist of fate, you`re on the inside track. Now that everyone likes you, they`re giving you a shot at success on your own terms. It`s a fine thing to be part of a team. Repay the honor by providing valuable input toward a common goal. Your new status comes with its share of perks, too. Accept any invitations that might come your way. For a variety of reasons, these are good people to know.',
      contentSnippet: 'Outsiders have their perspective, although it`s hard for them to play a hands-on game. Things are different for you this time. Through careful planning, good connections or just a twist of fate, you`re on the inside track. Now that everyone likes you, they`re giving you a shot at success on your own terms. It`s a fine thing to be part of a team. Repay the honor by providing valuable input toward a common goal. Your new status comes with its share of perks, too. Accept any invitations that might come your way. For a variety of reasons, these are good people to know.',
      muted: false
    },
    {
      id: 'https://horoscope.findyourfate.com/leodailyhoroscope.html',
      feed: {
        id: '5b802fc8-7fe0-4e27-954d-0b6ea01d0065',
        url: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
        muted: false,
        sections: [
          {
            id: 'horoscope',
            name: 'horoscope',
            muted: false
          }
        ]
      },
      title: 'Leo Horoscope for Tuesday, June 11, 2019',
      link: 'https://horoscope.findyourfate.com/leodailyhoroscope.html',
      content: 'Watch out for that proverbial wild hair. You`ve been on this ride before and you went to places that you later wished you`d left alone. You could get away with it if no one else is involved, but you`re not exactly operating in a vacuum. Yes, there`s a certain slapstick appeal to throwing a monkey wrench into the proceedings of a slow, boring day. But practical jokes in the workplace are just begging for trouble and trouble is exactly what you`d get. Intervene before letting the genie out of the bottle. Lose yourself in a good book if that`s what it takes to get a grip.',
      contentSnippet: 'Watch out for that proverbial wild hair. You`ve been on this ride before and you went to places that you later wished you`d left alone. You could get away with it if no one else is involved, but you`re not exactly operating in a vacuum. Yes, there`s a certain slapstick appeal to throwing a monkey wrench into the proceedings of a slow, boring day. But practical jokes in the workplace are just begging for trouble and trouble is exactly what you`d get. Intervene before letting the genie out of the bottle. Lose yourself in a good book if that`s what it takes to get a grip.',
      muted: false
    },
    {
      id: 'https://horoscope.findyourfate.com/virgodailyhoroscope.html',
      feed: {
        id: '5b802fc8-7fe0-4e27-954d-0b6ea01d0065',
        url: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
        muted: false,
        sections: [
          {
            id: 'horoscope',
            name: 'horoscope',
            muted: false
          }
        ]
      },
      title: 'Virgo Horoscope for Tuesday, June 11, 2019',
      link: 'https://horoscope.findyourfate.com/virgodailyhoroscope.html',
      content: 'You`re clear on the mission. Even if this is professional, it feels personal. Already you feel the driving force settling into your bones and taking over your mood. Now you`re locked into this. The last few pieces are falling into place as you close in on your goal. Now what? Maybe it`s too soon to tell. Don`t distract yourself with plans for the next phase until you finish this one. You don`t think anything went wrong, but you want to stay around and troubleshoot just in case there`s a problem. You`re a credit to your job title, whatever it is.',
      contentSnippet: 'You`re clear on the mission. Even if this is professional, it feels personal. Already you feel the driving force settling into your bones and taking over your mood. Now you`re locked into this. The last few pieces are falling into place as you close in on your goal. Now what? Maybe it`s too soon to tell. Don`t distract yourself with plans for the next phase until you finish this one. You don`t think anything went wrong, but you want to stay around and troubleshoot just in case there`s a problem. You`re a credit to your job title, whatever it is.',
      muted: false
    },
    {
      id: 'https://horoscope.findyourfate.com/libradailyhoroscope.html',
      feed: {
        id: '5b802fc8-7fe0-4e27-954d-0b6ea01d0065',
        url: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
        muted: false,
        sections: [
          {
            id: 'horoscope',
            name: 'horoscope',
            muted: false
          }
        ]
      },
      title: 'Libra Horoscope for Tuesday, June 11, 2019',
      link: 'https://horoscope.findyourfate.com/libradailyhoroscope.html',
      content: 'This is the wrong time to play super hero. Living in a perfect world, you`d be all things to all people at all times. Everyone knows and appreciates these qualities. Right now, though, circumstances are beyond your control. You don`t have all the pieces to make it work. Even more challenging, your reservoir of good will and compromise is running low. It looks as if you`ll have to confront some of your issues about sharing. Realize above all else that taking care of yourself is no crime. You have to be strong enough to help yourself in order to help anyone else.',
      contentSnippet: 'This is the wrong time to play super hero. Living in a perfect world, you`d be all things to all people at all times. Everyone knows and appreciates these qualities. Right now, though, circumstances are beyond your control. You don`t have all the pieces to make it work. Even more challenging, your reservoir of good will and compromise is running low. It looks as if you`ll have to confront some of your issues about sharing. Realize above all else that taking care of yourself is no crime. You have to be strong enough to help yourself in order to help anyone else.',
      muted: false
    },
    {
      id: 'https://horoscope.findyourfate.com/scorpiodailyhoroscope.html',
      feed: {
        id: '5b802fc8-7fe0-4e27-954d-0b6ea01d0065',
        url: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
        muted: false,
        sections: [
          {
            id: 'horoscope',
            name: 'horoscope',
            muted: false
          }
        ]
      },
      title: 'Scorpio Horoscope for Tuesday, June 11, 2019',
      link: 'https://horoscope.findyourfate.com/scorpiodailyhoroscope.html',
      content: 'Existential thoughts can wait. You`re no island these days. Anyway, you have business that needs your attention. It should be enough that everyone is standing on common ground without having to test the soil for its chemical properties. Like most people, you work with what comes to your hands, navigating by familiar sensations and landmarks. Boundaries just get in the way of understanding how all things are connected. You`ll probably hear yourself making more `we` statements than `me` statements. If there was any lingering question about where you belong, this should answer it once and for all.',
      contentSnippet: 'Existential thoughts can wait. You`re no island these days. Anyway, you have business that needs your attention. It should be enough that everyone is standing on common ground without having to test the soil for its chemical properties. Like most people, you work with what comes to your hands, navigating by familiar sensations and landmarks. Boundaries just get in the way of understanding how all things are connected. You`ll probably hear yourself making more `we` statements than `me` statements. If there was any lingering question about where you belong, this should answer it once and for all.',
      muted: false
    },
    {
      id: 'https://horoscope.findyourfate.com/sagittariusdailyhoroscope.html',
      feed: {
        id: '5b802fc8-7fe0-4e27-954d-0b6ea01d0065',
        url: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
        muted: false,
        sections: [
          {
            id: 'horoscope',
            name: 'horoscope',
            muted: false
          }
        ]
      },
      title: 'Sagittarius Horoscope for Tuesday, June 11, 2019',
      link: 'https://horoscope.findyourfate.com/sagittariusdailyhoroscope.html',
      content: 'What happened to the party? You blinked and suddenly everyone was back at work again. Welcome to the phenomenon generally known as Monday. If you think that fun is out of the question today, you`re limiting yourself. There are many ways to enjoy life while looking busy. And believe it or not, you might actually accomplish something useful in the process. Raise your standards and adjust your expectations, but don`t think small. Big plans fascinate you, while the details of making them happen keep you honest. Just remember that all excitement all the time would soon become boring.',
      contentSnippet: 'What happened to the party? You blinked and suddenly everyone was back at work again. Welcome to the phenomenon generally known as Monday. If you think that fun is out of the question today, you`re limiting yourself. There are many ways to enjoy life while looking busy. And believe it or not, you might actually accomplish something useful in the process. Raise your standards and adjust your expectations, but don`t think small. Big plans fascinate you, while the details of making them happen keep you honest. Just remember that all excitement all the time would soon become boring.',
      muted: false
    },
    {
      id: 'https://horoscope.findyourfate.com/capricorndailyhoroscope.html',
      feed: {
        id: '5b802fc8-7fe0-4e27-954d-0b6ea01d0065',
        url: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
        muted: false,
        sections: [
          {
            id: 'horoscope',
            name: 'horoscope',
            muted: false
          }
        ]
      },
      title: 'Capricorn Horoscope for Tuesday, June 11, 2019',
      link: 'https://horoscope.findyourfate.com/capricorndailyhoroscope.html',
      content: 'The spotlight moves toward you. Maybe some human hand guides it after someone decided that this is your moment. Maybe the Sun shines on you again thanks to a celestial decision. Don`t trouble yourself about the reasons right now. Drop whatever you`re doing, particularly if it involves worrying. Find the person that you love the most, and do whatever you love to do. Maybe this means doing nothing at all, which would be fine for a change. When you`ve carried the world on your shoulders for this long, there`s nothing better than stretching and relaxing those capable but tired muscles.',
      contentSnippet: 'The spotlight moves toward you. Maybe some human hand guides it after someone decided that this is your moment. Maybe the Sun shines on you again thanks to a celestial decision. Don`t trouble yourself about the reasons right now. Drop whatever you`re doing, particularly if it involves worrying. Find the person that you love the most, and do whatever you love to do. Maybe this means doing nothing at all, which would be fine for a change. When you`ve carried the world on your shoulders for this long, there`s nothing better than stretching and relaxing those capable but tired muscles.',
      muted: false
    },
    {
      id: 'https://horoscope.findyourfate.com/aquariusdailyhoroscope.html',
      feed: {
        id: '5b802fc8-7fe0-4e27-954d-0b6ea01d0065',
        url: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
        muted: false,
        sections: [
          {
            id: 'horoscope',
            name: 'horoscope',
            muted: false
          }
        ]
      },
      title: 'Aquarius Horoscope for Tuesday, June 11, 2019',
      link: 'https://horoscope.findyourfate.com/aquariusdailyhoroscope.html',
      content: 'The people closest to you are usually the ones requiring the least maintenance. Right now, though, they`re especially needy. What did you do to deserve this? When you think about it, this is actually a small price to pay for services received so far. Hide your annoyance or anger so that you won`t seem ungrateful. If you have to change your plans, so be it. The more flexible you are, the more options you`ll have and the faster your day will go. You learn valuable lessons when you finally study what you`ve always taken for granted.',
      contentSnippet: 'The people closest to you are usually the ones requiring the least maintenance. Right now, though, they`re especially needy. What did you do to deserve this? When you think about it, this is actually a small price to pay for services received so far. Hide your annoyance or anger so that you won`t seem ungrateful. If you have to change your plans, so be it. The more flexible you are, the more options you`ll have and the faster your day will go. You learn valuable lessons when you finally study what you`ve always taken for granted.',
      muted: false
    },
    {
      id: 'https://horoscope.findyourfate.com/piscesdailyhoroscope.html',
      feed: {
        id: '5b802fc8-7fe0-4e27-954d-0b6ea01d0065',
        url: 'https://www.findyourfate.com/rss/horoscope-astrology.php',
        muted: false,
        sections: [
          {
            id: 'horoscope',
            name: 'horoscope',
            muted: false
          }
        ]
      },
      title: 'Pisces Horoscope for Tuesday, June 11, 2019',
      link: 'https://horoscope.findyourfate.com/piscesdailyhoroscope.html',
      content: 'Bargain hunters corner the market on something whose value no one else understands. Knowledge is worth a lot, but you can`t beat the cost of free advice. Some people tell the best stories. Let them enrich your life with events that you may never experience in person. You feel honored by the gift of ideas. The more you wrestle with these things, the higher and deeper they take you. Anyone who`s afraid that you`re not doing enough can rest assured that you`re having a rich internal life. By evening, your excellent brainstorm might even show up on the local weather report.',
      contentSnippet: 'Bargain hunters corner the market on something whose value no one else understands. Knowledge is worth a lot, but you can`t beat the cost of free advice. Some people tell the best stories. Let them enrich your life with events that you may never experience in person. You feel honored by the gift of ideas. The more you wrestle with these things, the higher and deeper they take you. Anyone who`s afraid that you`re not doing enough can rest assured that you`re having a rich internal life. By evening, your excellent brainstorm might even show up on the local weather report.',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/11/how-china-could-shut-down-americas-defenses-rare-earth/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Keith Johnson and Lara Seligman',
      title: 'How China Could Shut Down America’s Defenses',
      link: 'https://foreignpolicy.com/2019/06/11/how-china-could-shut-down-americas-defenses-rare-earth/',
      pubDate: 'Tue, 11 Jun 2019 21:10:29 +0000',
      'content:encoded': 'Advanced U.S. weapons are almost entirely reliant on rare-earth materials only made in China—and they could be a casualty of the trade war.',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/5449474.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Keith Johnson and Lara Seligman',
      comments: 'https://foreignpolicy.com/2019/06/11/how-china-could-shut-down-americas-defenses-rare-earth/#respond',
      content: 'Advanced U.S. weapons are almost entirely reliant on rare-earth materials only made in China—and they could be a casualty of the trade war.',
      contentSnippet: 'Advanced U.S. weapons are almost entirely reliant on rare-earth materials only made in China—and they could be a casualty of the trade war.',
      guid: 'https://foreignpolicy.com/?p=970246',
      categories: [
        'Report',
        'China',
        'Military'
      ],
      isoDate: '2019-06-11T21:10:29.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/11/trumps-iran-crackdown-isnt-enough-to-stop-hezbollah/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Emanuele Ottolenghi',
      title: 'Trump’s Iran Crackdown Isn’t Enough to Stop Hezbollah',
      link: 'https://foreignpolicy.com/2019/06/11/trumps-iran-crackdown-isnt-enough-to-stop-hezbollah/',
      pubDate: 'Tue, 11 Jun 2019 21:01:31 +0000',
      'content:encoded': 'Unless Washington targets the group more effectively, it can outlive the pressure on Tehran.',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/TrumpIranGettyImages-1142523779.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Emanuele Ottolenghi',
      comments: 'https://foreignpolicy.com/2019/06/11/trumps-iran-crackdown-isnt-enough-to-stop-hezbollah/#respond',
      content: 'Unless Washington targets the group more effectively, it can outlive the pressure on Tehran.',
      contentSnippet: 'Unless Washington targets the group more effectively, it can outlive the pressure on Tehran.',
      guid: 'https://foreignpolicy.com/?p=970177',
      categories: [
        'Argument',
        'Hezbollah',
        'Iran',
        'Latin America',
        'Lebanon',
        'Middle East',
        'U.S. Foreign Policy'
      ],
      isoDate: '2019-06-11T21:01:31.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/11/mexicos-southern-border-trump-immigration-deal-tariffs-iran-sudan/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Audrey Wilson',
      title: 'Mexico’s Other Border',
      link: 'https://foreignpolicy.com/2019/06/11/mexicos-southern-border-trump-immigration-deal-tariffs-iran-sudan/',
      pubDate: 'Tue, 11 Jun 2019 10:00:50 +0000',
      'content:encoded': 'Plus: Observers fear spiraling violence in Sudan, a scandal erupts in Brazil, and the other stories we\'re following today.',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/GettyImages-1148477176-MEXICO-GUATEMALA-IMMIGRATION.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Audrey Wilson',
      comments: 'https://foreignpolicy.com/2019/06/11/mexicos-southern-border-trump-immigration-deal-tariffs-iran-sudan/#respond',
      content: 'Plus: Observers fear spiraling violence in Sudan, a scandal erupts in Brazil, and the other stories we\'re following today.',
      contentSnippet: 'Plus: Observers fear spiraling violence in Sudan, a scandal erupts in Brazil, and the other stories we\'re following today.',
      guid: 'https://foreignpolicy.com/?p=970235',
      categories: [
        'Morning Brief',
        'Brazil',
        'Egypt',
        'Elections',
        'Iran',
        'Mexico',
        'Migration/Immigration',
        'Military',
        'North America',
        'North Korea',
        'Philippines',
        'Russia',
        'South Africa',
        'Sudan',
        'Trade',
        'Trump',
        'Turkey',
        'United States',
        'vietnam'
      ],
      isoDate: '2019-06-11T10:00:50.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/10/moldovas-governments-go-head-to-head/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Amy Mackinnon',
      title: 'Moldova’s Governments Go Head to Head',
      link: 'https://foreignpolicy.com/2019/06/10/moldovas-governments-go-head-to-head/',
      pubDate: 'Tue, 11 Jun 2019 00:19:40 +0000',
      'content:encoded': 'One of Europe’s poorest countries plunges into crisis.',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/moldova.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Amy Mackinnon',
      comments: 'https://foreignpolicy.com/2019/06/10/moldovas-governments-go-head-to-head/#respond',
      content: 'One of Europe’s poorest countries plunges into crisis.',
      contentSnippet: 'One of Europe’s poorest countries plunges into crisis.',
      guid: 'https://foreignpolicy.com/?p=970206',
      categories: [
        'Explainer',
        'Europe',
        'moldova',
        'Russia'
      ],
      isoDate: '2019-06-11T00:19:40.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/10/dudas-ego-trip/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Melissa Hooper',
      title: 'Duda’s Ego Trip',
      link: 'https://foreignpolicy.com/2019/06/10/dudas-ego-trip/',
      pubDate: 'Tue, 11 Jun 2019 00:06:34 +0000',
      'content:encoded': 'The Polish president will try to convince Trump to send U.S. troops to his country. Congress should push Trump to resist.',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/GettyImages-1035606738.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Melissa Hooper',
      comments: 'https://foreignpolicy.com/2019/06/10/dudas-ego-trip/#respond',
      content: 'The Polish president will try to convince Trump to send U.S. troops to his country. Congress should push Trump to resist.',
      contentSnippet: 'The Polish president will try to convince Trump to send U.S. troops to his country. Congress should push Trump to resist.',
      guid: 'https://foreignpolicy.com/?p=970217',
      categories: [
        'Argument',
        'Democracy',
        'far right parties',
        'Poland',
        'Trump'
      ],
      isoDate: '2019-06-11T00:06:34.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/10/accused-of-indifference-trump-team-set-to-appoint-sudan-advisor-khartoum-violence-protests-east-africa-diplomacy-state-department/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Robbie Gramer and Justin Lynch',
      title: 'Accused of Inaction, Trump Team Set to Appoint Sudan Advisor',
      link: 'https://foreignpolicy.com/2019/06/10/accused-of-indifference-trump-team-set-to-appoint-sudan-advisor-khartoum-violence-protests-east-africa-diplomacy-state-department/',
      pubDate: 'Mon, 10 Jun 2019 22:47:49 +0000',
      'content:encoded': 'Former U.S. diplomat Donald Booth expected to address the bloody impasse between military and protesters as U.N. officials warn of spiraling violence.\r\n',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/GettyImages-1141001052.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Robbie Gramer and Justin Lynch',
      comments: 'https://foreignpolicy.com/2019/06/10/accused-of-indifference-trump-team-set-to-appoint-sudan-advisor-khartoum-violence-protests-east-africa-diplomacy-state-department/#respond',
      content: 'Former U.S. diplomat Donald Booth expected to address the bloody impasse between military and protesters as U.N. officials warn of spiraling violence.\r\n',
      contentSnippet: 'Former U.S. diplomat Donald Booth expected to address the bloody impasse between military and protesters as U.N. officials warn of spiraling violence.',
      guid: 'https://foreignpolicy.com/?p=970202',
      categories: [
        'Exclusive',
        'Africa',
        'Diplomacy',
        'State Department'
      ],
      isoDate: '2019-06-10T22:47:49.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/10/fighter-jet-turkey-pentagon-u-s-grounds-turkish-f-35-pilots/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Lara Seligman',
      title: 'U.S. Grounds Turkish F-35 Pilots',
      link: 'https://foreignpolicy.com/2019/06/10/fighter-jet-turkey-pentagon-u-s-grounds-turkish-f-35-pilots/',
      pubDate: 'Mon, 10 Jun 2019 22:03:08 +0000',
      'content:encoded': 'Pilots no longer allowed to fly or access restricted information as spat over Russian missile defense system continues.',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/5078929.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Lara Seligman',
      comments: 'https://foreignpolicy.com/2019/06/10/fighter-jet-turkey-pentagon-u-s-grounds-turkish-f-35-pilots/#respond',
      content: 'Pilots no longer allowed to fly or access restricted information as spat over Russian missile defense system continues.',
      contentSnippet: 'Pilots no longer allowed to fly or access restricted information as spat over Russian missile defense system continues.',
      guid: 'https://foreignpolicy.com/?p=970194',
      categories: [
        'Exclusive',
        'Military',
        'Turkey'
      ],
      isoDate: '2019-06-10T22:03:08.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/10/nobodys-asking-for-trump-to-be-a-genius/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Stephen M. Walt',
      title: 'Nobody’s Asking for Trump to Be a Genius',
      link: 'https://foreignpolicy.com/2019/06/10/nobodys-asking-for-trump-to-be-a-genius/',
      pubDate: 'Mon, 10 Jun 2019 21:41:44 +0000',
      'content:encoded': 'But is it too much for him to at least show some foreign-policy common sense?',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/GettyImages-578546944.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Stephen M. Walt',
      comments: 'https://foreignpolicy.com/2019/06/10/nobodys-asking-for-trump-to-be-a-genius/#respond',
      content: 'But is it too much for him to at least show some foreign-policy common sense?',
      contentSnippet: 'But is it too much for him to at least show some foreign-policy common sense?',
      guid: 'https://foreignpolicy.com/?p=970184',
      categories: [
        'Voice',
        'Trump',
        'U.S. Foreign Policy',
        'United States'
      ],
      isoDate: '2019-06-10T21:41:44.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/10/duterte-turns-death-squads-on-political-activists/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Nick Aspinwall',
      title: 'Duterte Turns Death Squads on Political Activists',
      link: 'https://foreignpolicy.com/2019/06/10/duterte-turns-death-squads-on-political-activists/',
      pubDate: 'Mon, 10 Jun 2019 20:02:07 +0000',
      'content:encoded': 'Government-backed vigilantes in the Philippines are targeting farmers and protesters. ',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/GettyImages-936706736.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Nick Aspinwall',
      comments: 'https://foreignpolicy.com/2019/06/10/duterte-turns-death-squads-on-political-activists/#respond',
      content: 'Government-backed vigilantes in the Philippines are targeting farmers and protesters. ',
      contentSnippet: 'Government-backed vigilantes in the Philippines are targeting farmers and protesters.',
      guid: 'https://foreignpolicy.com/?p=970181',
      categories: [
        'Argument',
        'Duterte',
        'Philippines',
        'war crimes'
      ],
      isoDate: '2019-06-10T20:02:07.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/10/the-fed-is-trumps-secret-ally-in-the-trade-war/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Chris Miller',
      title: 'The Fed Is Trump’s Secret Ally in the Trade War',
      link: 'https://foreignpolicy.com/2019/06/10/the-fed-is-trumps-secret-ally-in-the-trade-war/',
      pubDate: 'Mon, 10 Jun 2019 18:05:17 +0000',
      'content:encoded': 'By lowering interest rates, the body is cushioning the blow of tariffs and convincing the president that they are working.',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/GettyImages-79158566.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Chris Miller',
      comments: 'https://foreignpolicy.com/2019/06/10/the-fed-is-trumps-secret-ally-in-the-trade-war/#respond',
      content: 'By lowering interest rates, the body is cushioning the blow of tariffs and convincing the president that they are working.',
      contentSnippet: 'By lowering interest rates, the body is cushioning the blow of tariffs and convincing the president that they are working.',
      guid: 'https://foreignpolicy.com/?p=970172',
      categories: [
        'Argument',
        'Federal Reserve',
        'trade war',
        'Trump'
      ],
      isoDate: '2019-06-10T18:05:17.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/10/kazakhstans-second-ever-president-cant-tolerate-protest/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Reid Standish',
      title: 'Kazakhstan’s Second-Ever President Can’t Tolerate Protest',
      link: 'https://foreignpolicy.com/2019/06/10/kazakhstans-second-ever-president-cant-tolerate-protest/',
      pubDate: 'Mon, 10 Jun 2019 17:00:54 +0000',
      'content:encoded': 'Nazarbayev’s successor has an impressive foreign profile but a raft of domestic problems.',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/GettyImages-1148922685.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Reid Standish',
      comments: 'https://foreignpolicy.com/2019/06/10/kazakhstans-second-ever-president-cant-tolerate-protest/#respond',
      content: 'Nazarbayev’s successor has an impressive foreign profile but a raft of domestic problems.',
      contentSnippet: 'Nazarbayev’s successor has an impressive foreign profile but a raft of domestic problems.',
      guid: 'https://foreignpolicy.com/?p=970160',
      categories: [
        'Dispatch',
        'Central Asia',
        'China',
        'Democracy',
        'Elections',
        'kazakhstan',
        'Russia'
      ],
      isoDate: '2019-06-10T17:00:54.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/10/pentagon-warns-turkey-of-sanctions-over-russian-missile-system/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Lara Seligman',
      title: 'Pentagon Warns Turkey of Sanctions Over Russian Missile System',
      link: 'https://foreignpolicy.com/2019/06/10/pentagon-warns-turkey-of-sanctions-over-russian-missile-system/',
      pubDate: 'Mon, 10 Jun 2019 12:30:19 +0000',
      'content:encoded': 'Decision to start ‘unwinding’ Turkey from the F-35 fighter jet program is the latest sign of strained ties between the two nations.  ',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/GettyImages-529560632.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Lara Seligman',
      comments: 'https://foreignpolicy.com/2019/06/10/pentagon-warns-turkey-of-sanctions-over-russian-missile-system/#respond',
      content: 'Decision to start ‘unwinding’ Turkey from the F-35 fighter jet program is the latest sign of strained ties between the two nations.  ',
      contentSnippet: 'Decision to start ‘unwinding’ Turkey from the F-35 fighter jet program is the latest sign of strained ties between the two nations.',
      guid: 'https://foreignpolicy.com/?p=970152',
      categories: [
        'Security Brief',
        'Situation Report'
      ],
      isoDate: '2019-06-10T12:30:19.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/10/hong-kongs-last-stand-extradition-trump-mexico-iran/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Audrey Wilson',
      title: 'Hong Kong’s Last Stand',
      link: 'https://foreignpolicy.com/2019/06/10/hong-kongs-last-stand-extradition-trump-mexico-iran/',
      pubDate: 'Mon, 10 Jun 2019 08:41:09 +0000',
      'content:encoded': 'Plus: Mexico faces new pressure on immigration, Germany meets with Iran, and what to watch in the world this week.',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/GettyImages-1148672940-HONG-KONG-EXTRADITION.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Audrey Wilson',
      comments: 'https://foreignpolicy.com/2019/06/10/hong-kongs-last-stand-extradition-trump-mexico-iran/#respond',
      content: 'Plus: Mexico faces new pressure on immigration, Germany meets with Iran, and what to watch in the world this week.',
      contentSnippet: 'Plus: Mexico faces new pressure on immigration, Germany meets with Iran, and what to watch in the world this week.',
      guid: 'https://foreignpolicy.com/?p=970144',
      categories: [
        'Morning Brief',
        'Britain',
        'China',
        'coal',
        'Colombia',
        'East Asia',
        'Elections',
        'Europe',
        'Germany',
        'Guatemala',
        'Hong Kong',
        'Iran',
        'Japan',
        'kazakhstan',
        'Mexico',
        'Migration/Immigration',
        'moldova',
        'Nicaragua',
        'protests',
        'Russia',
        'Spain',
        'Sudan',
        'Trade',
        'Trump',
        'Venezuela'
      ],
      isoDate: '2019-06-10T08:41:09.000Z',
      muted: false
    },
    {
      id: 'https://foreignpolicy.com/2019/06/09/when-coal-came-to-paradise-china-coal-kenya-lamu-pollution-africa-chinese-industry-bri/',
      feed: {
        id: 'foreignpolicy.com/feed',
        url: 'foreignpolicy.com/feed',
        muted: false
      },
      creator: 'Dana Ullman',
      title: 'When Coal Comes to Paradise',
      link: 'https://foreignpolicy.com/2019/06/09/when-coal-came-to-paradise-china-coal-kenya-lamu-pollution-africa-chinese-industry-bri/',
      pubDate: 'Sun, 09 Jun 2019 08:48:24 +0000',
      'content:encoded': 'As China pushes clean energy policies at home, it is exporting its high-pollution coal industry to pristine places like Kenya’s Lamu Island—with Nairobi’s seal of approval. Local residents fear it will destroy the environment they depend on.',
      enclosure: {
        url: 'https://foreignpolicy.com/wp-content/uploads/2019/06/Lamu-Kenya-coal-development-China_16.jpg',
        length: '1024',
        type: 'image/jpeg'
      },
      'dc:creator': 'Dana Ullman',
      comments: 'https://foreignpolicy.com/2019/06/09/when-coal-came-to-paradise-china-coal-kenya-lamu-pollution-africa-chinese-industry-bri/#respond',
      content: 'As China pushes clean energy policies at home, it is exporting its high-pollution coal industry to pristine places like Kenya’s Lamu Island—with Nairobi’s seal of approval. Local residents fear it will destroy the environment they depend on.',
      contentSnippet: 'As China pushes clean energy policies at home, it is exporting its high-pollution coal industry to pristine places like Kenya’s Lamu Island—with Nairobi’s seal of approval. Local residents fear it will destroy the environment they depend on.',
      guid: 'https://foreignpolicy.com/?p=970073',
      categories: [
        'Feature',
        'China',
        'climate change',
        'coal',
        'energy policy',
        'Kenya',
        'Photo Essay'
      ],
      isoDate: '2019-06-09T08:48:24.000Z',
      muted: false
    }
  ]