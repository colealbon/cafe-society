import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import RemoveGaiaLink from './RemoveGaiaLink'
import { removeGaiaLink } from '../../actions/gaiaLinkActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListSubheader from '@material-ui/core/ListSubheader'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import JSONTree from 'react-json-tree'

const mapStateToProps = ({ gaiaLinks }) => {
  return {
    gaiaLinks: gaiaLinks
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleClickRemoveGaiaLink: (gaiaLink, gaiaLinks) => {
      dispatch(removeGaiaLink(gaiaLink, gaiaLinks))
    },
    handleClickRemoveAllGaiaLinks: (gaiaLinks) => {
      gaiaLinks.map((gaiaLink) => dispatch(removeGaiaLink(gaiaLink, gaiaLinks)))
    }
  }
}

export const GaiaLinkList = ({ handleClickRemoveGaiaLink, handleClickRemoveAllGaiaLinks, gaiaLinks }) => {
  const deleteSweepGaiaLink = `delete: ${[].concat(gaiaLinks).length} links`
  return (
    <Fragment>
      <List subheader={<ListSubheader>GaiaLinks</ListSubheader>} >
        <ListItem key='addItem'>
          <ListItemIcon>
            <IconButton title={deleteSweepGaiaLink} onClick={() => { handleClickRemoveAllGaiaLinks(gaiaLinks, gaiaLinks) }}>
              <DeleteSweepIcon></DeleteSweepIcon>
            </IconButton>
          </ ListItemIcon>
        </ListItem>
        {gaiaLinks.map((gaiaLink) => {
          return (
            <ListItem key={gaiaLink.gaiaUrl}>
              <RemoveGaiaLink
                {...gaiaLink}
                onClick={() => {
                  handleClickRemoveGaiaLink(gaiaLink, gaiaLinks)
                }}
              />
              <Typography><Link href={gaiaLink.gaiaUrl}>{gaiaLink.articleId}</Link></Typography>
              <br />
              <Typography><JSONTree hideRoot={true} data={gaiaLink} /></Typography>
            </ListItem>
          )
        }).reverse()
        }
      </List>
    </Fragment>
  )
}

GaiaLinkList.propTypes = {
  handleClickRemoveGaiaLink: PropTypes.func.isRequired,
  handleClickToggleGaiaLink: PropTypes.func.isRequired,
  handleClickRemoveAllGaiaLinks: PropTypes.func.isRequired,
  gaiaLinks: PropTypes.array.isRequired,
}
export default connect(mapStateToProps, mapDispatchToProps)(GaiaLinkList)