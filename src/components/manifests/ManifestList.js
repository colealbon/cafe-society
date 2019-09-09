import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import RemoveManifest from './RemoveManifest'
import { removeManifest } from '../../actions/manifestActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import Link from '@material-ui/core/Link'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListSubheader from '@material-ui/core/ListSubheader'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
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
      dispatch(removeManifest(manifests, manifests))
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
            <ListItem key={manifest.link}>
              <RemoveManifest
                {...manifest}
                onClick={() => {
                  handleClickRemoveManifest(manifest, manifests)
                }}
              />
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  id="panel1bh-header"
                >
                  <Link href={manifest.link}>{manifest.link}</Link>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                <JSONTree hideRoot={true} data={manifest} />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </ListItem>
          )
        })
        }
      </List>
    </Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ManifestList)