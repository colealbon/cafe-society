import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import AddSection from './AddSection'
import RemoveSection from './RemoveSection'
import { removeSection, toggleSection } from '../../actions/sectionActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Switch from '@material-ui/core/Switch'

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

export const SectionList = ({ handleClickRemoveSection, handleClickToggleSection, handleClickRemoveAllSections, sections }) => {
  const deleteSweepSection = `delete: ${[].concat(sections).length}`
  return (
    <Fragment>
      <br />
      <br />
      <br />
      <br />
      <List subheader={<ListSubheader>Edit/Save Sections</ListSubheader>} >
        <ListItem key='addItem'>
          <ListItemIcon>
            <IconButton title={deleteSweepSection} onClick={() => { handleClickRemoveAllSections(sections) }}>
              <DeleteSweepIcon></DeleteSweepIcon>
            </IconButton>
          </ ListItemIcon>
          <AddSection />
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
                <Switch checked={!section.muted} />
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

// handleClickRemoveSection, handleClickToggleSection, handleClickRemoveAllSections, sections

SectionList.propTypes = {
  handleClickRemoveSection: PropTypes.func.isRequired,
  handleClickToggleSection: PropTypes.func.isRequired,
  handleClickRemoveAllSections: PropTypes.func.isRequired,
  sections: PropTypes.array.isRequired,
}
export default connect(mapStateToProps, mapDispatchToProps)(SectionList)
// export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SectionList));
