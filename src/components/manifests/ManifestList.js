import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import RemoveManifest from './RemoveManifest'
import { removeManifest } from '../../actions/manifestActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListSubheader from '@material-ui/core/ListSubheader'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import JSONTree from 'react-json-tree'

const mapStateToProps = ({ manifests }) => {
  return {
    manifests: manifests
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleClickRemoveManifest: (manifest, manifests) => {
      dispatch(removeManifest(manifest, manifests))
    },
    handleClickRemoveAllManifests: (manifests) => {
      manifests.map((manifest) => dispatch(removeManifest(manifest, manifests)))
    }
  }
}

export const ManifestList = ({ handleClickRemoveManifest, handleClickRemoveAllManifests, manifests }) => {
  const deleteSweepManifest = `delete: ${[].concat(manifests).length} links`
  return (
    <Fragment>
      <List subheader={<ListSubheader>Manifests</ListSubheader>} >
        <ListItem key='addItem'>
          <ListItemIcon>
            <IconButton title={deleteSweepManifest} onClick={() => { handleClickRemoveAllManifests(manifests, manifests) }}>
              <DeleteSweepIcon></DeleteSweepIcon>
            </IconButton>
          </ ListItemIcon>
        </ListItem>
        {manifests.map((manifest) => {
          return (
            <ListItem key={manifest.gaiaUrl}>
              <RemoveManifest
                {...manifest}
                onClick={() => {
                  handleClickRemoveManifest(manifest, manifests)
                }}
              />
              <Typography><Link href={manifest.gaiaUrl}>{manifest.articleId}</Link></Typography>
              <br />
              <p></p>
              <Typography><JSONTree hideRoot={true} data={manifest} /></Typography>
            </ListItem>
          )
        }).reverse()
        }
      </List>
    </Fragment>
  )
}

ManifestList.propTypes = {
  handleClickRemoveManifest: PropTypes.func.isRequired,
  handleClickToggleManifest: PropTypes.func.isRequired,
  handleClickRemoveAllManifests: PropTypes.func.isRequired,
  manifests: PropTypes.array.isRequired,
}
export default connect(mapStateToProps, mapDispatchToProps)(ManifestList)