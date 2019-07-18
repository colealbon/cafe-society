import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Check, DeleteSweep, VoiceOverOff, CancelPresentation } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { removeArticle, toggleArticle } from '../../actions/articleActions'
import { addFilter} from '../../actions/filterActions'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {parse} from 'tldjs';
import PropTypes from 'prop-types'
import VerticalSpace from '../VerticalSpace'
import JSONTree from 'react-json-tree'

const mapStateToProps = ({ selectedSection, articles, filters }) => {
  return {
    selectedSection: !!selectedSection ? selectedSection :  {name: ''},
    articles: !!articles ? articles : [],
    filters: !!filters ? filters : [{
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
    }]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickShadowBanDomain: (link, selectedSection, filters) => {
      dispatch(addFilter({id: parse(link).domain, text: parse(link).domain, fields: [{id:'link',name:'link',muted:false}], sections: [selectedSection], muted: false, }, filters))
    },
    handleClickRemoveArticle: (article, articles) => {
      dispatch(removeArticle(article, articles))
    },
    handleClickToggleArticle: (article, articles) => {
      dispatch(toggleArticle(article, articles))
    },
    handleClickResetAppData: () => {
      dispatch({type: 'RESET_APP'})
    },
    handleClickRemoveAllArticles: (articles) => {
      dispatch(removeArticle(articles, articles))
    }
  }
}

export const SectionPage = ({ handleClickResetAppData, handleClickShadowBanDomain, handleClickRemoveAllArticles, handleClickToggleArticle, articles, selectedSection, filters}) => {
  const sectionTitle = (selectedSection.id) ? `${selectedSection.id}` : 'enhanced'
  const deleteSweepTitle = `delete: ${articles.length} articles`
  return (
    <Fragment>
      <VerticalSpace/>
      <Typography variant="h4" >
        <IconButton title={deleteSweepTitle} onClick={() => {handleClickRemoveAllArticles(articles)}}>
          <DeleteSweep></DeleteSweep>
        </IconButton>
        <IconButton title='reset all app data' onClick={() => {handleClickResetAppData(articles)}}>
          <CancelPresentation></CancelPresentation>
        </IconButton>
        {sectionTitle}
      </Typography>
      <p />
      {articles
        .map((article) => {
        const banDomainTitle = `add ${parse(article.link).domain} to filters`
        return (
          <Grid item xs={12} key={article.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" >
                  <IconButton title="mark article as read" onClick={() => handleClickToggleArticle(article, articles)}>
                    <Check
                      id='checkToggleArticle'
                      style={{ color: 'green' }}
                    />
                  </IconButton>
                  <a href={article.link} target="newsfeed-demo-article">{(!!article.title) ? article.title.replace(/&apos;/g, "\'").replace(/&amp;/g, "&") : ''}</a>
                  <IconButton title={banDomainTitle} onClick={() => handleClickShadowBanDomain(parse(article.link).domain, selectedSection, filters)} >
                  <VoiceOverOff></VoiceOverOff>
                  </IconButton>
                </Typography>
                <Typography>{(article.contentSnippet) ? article.contentSnippet.replace(/&apos;/g, "\'").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ") : '' }</Typography>         
                {(!article.blockReasons) ? '' : <Typography>blockReasons:<JSONTree data={article.blockReasons} /></Typography>}
                <Typography>feed: {JSON.stringify(article.feed)}</Typography>
                {(!!article.muted) ? <Typography>muted: {JSON.stringify(article.muted)}</Typography>:''}
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Fragment>
  )
}

SectionPage.propTypes = {
  selectedSection: PropTypes.object.isRequired,
  articles: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SectionPage)

// import React, { Fragment } from 'react'
// import { connect } from 'react-redux'
// import { Check, VoiceOverOff, DeleteSweep } from '@material-ui/icons';
// import IconButton from '@material-ui/core/IconButton';
// import Typography from '@material-ui/core/Typography';
// import { removeArticle, toggleArticle } from '../../actions/articleActions'
// import { addFilter} from '../../actions/filterActions'
// import Grid from '@material-ui/core/Grid';
// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
// import {parse} from 'tldjs';
// import PropTypes from 'prop-types'
// import VerticalSpace from '../VerticalSpace'
// import { RemoveCircle } from '@material-ui/icons'

// const mapStateToProps = ({ selectedSection, articles, filters }) => {
//   return {
//     selectedSection: selectedSection,
//     articles: articles,
//     filters: filters
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     handleClickShadowBanDomain: (link, selectedSection, filters) => {
//       dispatch(addFilter({id: parse(link).domain, text: parse(link).domain, fields: [{id:'link',name:'link',muted:false}], sections: [selectedSection], muted: false, }, filters))
//     },
//     handleClickRemoveArticle: (article, articles) => {
//       dispatch(removeArticle(article, articles))
//     },
//     handleClickToggleArticle: (article, articles) => {
//       dispatch(toggleArticle(article, articles))
//     },
//     handleClickMarkAllRead: (articles, allArticles) => {
//       dispatch(markArticleRead(articles, allArticles))
//     },
//     handleClickRemoveAllArticles: (articles) => {
//       dispatch(removeArticle(articles, articles))
//     }
//   }
// }

// export const SectionPage = ({ handleClickShadowBanDomain, handleClickRemoveAllArticles, handleClickRemoveArticle, handleClickMarkAllRead, handleClickToggleArticle, articles, sections, filters, selectedSection}) => {
//   const sectionTitle = (selectedSection.id) ? `${selectedSection.id}` : 'enhaanced'
//   const deleteSweepTitle = `delete: ${articles.length} articles`
//   return (
//     <Fragment>
//       <VerticalSpace/>
//       <Typography variant="h4" >{sectionTitle}     
//       </Typography>
//       <IconButton title={deleteSweepTitle} onClick={() => {handleClickRemoveAllArticles(articles)}}>
//         <DeleteSweep></DeleteSweep>
//       </IconButton>
//       {articles
//         .map((article) => {
//         const banDomainTitle = `add ${parse(article.link).domain} to filters`
//         return (
//           <Grid item xs={12} key={article.id}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6" >
//                   <IconButton title="mark article as read" onClick={() => handleClickToggleArticle(article, articles)}>
//                     <Check
//                       id='checkToggleArticle'
//                       style={{ color: 'green' }}
//                     />
//                   </IconButton>
//                   <IconButton title={`delete ${name}`} onClick={() => handleClickRemoveArticle(article, articles)}>
//                     <RemoveCircle></RemoveCircle>
//                   </IconButton>
//                   <a href={article.link} target="cafe-society-article">{article.title}</a>
//                   <IconButton title={banDomainTitle} onClick={() => handleClickShadowBanDomain(parse(article.link).domain, selectedSection, filters)} >
//                   <VoiceOverOff></VoiceOverOff>
//                   </IconButton>
//                 </Typography>
//                 <Typography>{article.contentSnippet}</Typography>
//                 {(!!article.blockReasons) ? <Typography>blockReasons: {JSON.stringify(article.blockReasons)}</Typography>:''}
//                 <Typography>feed: {JSON.stringify(article.feed)}</Typography>
//                 {(!!article.muted) ? <Typography>muted: {JSON.stringify(article.muted)}</Typography>:''}
//               </CardContent>
//             </Card>
//           </Grid>
//         )
//       })}
//     </Fragment>
//   )
// }

// SectionPage.propTypes = {
//   selectedSection: PropTypes.object.isRequired,
//   articles: PropTypes.array.isRequired
// };

// export default connect(mapStateToProps, mapDispatchToProps)(SectionPage)
