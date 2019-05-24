import React, { Fragment } from "react"
import { connect } from 'react-redux'
import AddSection from './AddSection'
import RemoveSection from './RemoveSection'
import { removeSection, toggleSection } from '../../actions/sectionActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from 'mdi-react/DeleteSweepIcon'

import Loading from '../Loading';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';

const mapStateToProps = ({ sections }) => {
  return {
    sections: sections
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleClickRemoveSection: (section) => {
      dispatch(removeSection(section))
    },
    handleClickToggleSection: (section) => {
      dispatch(toggleSection(section))
    },
    handleClickRemoveAllSections: (sections) => {
      sections.map((section) => dispatch(removeSection(section)))
    }
  }
}

export const SectionList = ({ handleClickRemoveSection, handleClickToggleSection, handleClickRemoveAllSections, publishSections, sections, ...rest}) => {
  const deleteSweepSection = `delete: ${[].concat(sections).length}`
  return (
    <Fragment>
    <br />
    <br />
    <br />
      <List subheader={<ListSubheader>Edit Sections</ListSubheader>} >
        <ListItem key='addItem'>
          <IconButton title={deleteSweepSection} onClick={() => {handleClickRemoveAllSections(sections)}}>
            <DeleteSweepIcon></DeleteSweepIcon>
          </IconButton>
          <AddSection />
          <Loading />
        </ListItem>
        {sections.map((section) => {
          return (
            <ListItem key={section.id}>
              <RemoveSection
                {...section}
                onClick={() => {
                  handleClickRemoveSection(section)
                }}
              />
              <span
                onClick={() => {
                  handleClickToggleSection(section)
                }}
                title={section.muted ? `enable ${section.name}` : `disable {section.name}` }
              >
              <Switch checked={!section.muted}  />
              </span>
              <ListItemText primary={section.name} />
            </ListItem>
          )
        }).reverse()
      }
      </List>
    </Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionList);
//export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SectionList));
