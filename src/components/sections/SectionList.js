import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import AddSection from './AddSection'
import RemoveSection from './RemoveSection'
import { removeSection, toggleSection } from '../../actions/sectionActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import VerticalSpace from '../VerticalSpace'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Switch from '@material-ui/core/Switch'

const mapStateToProps = ({ sections }) => {
  return {
    sections: !!sections ? sections : [{id: 'headlines', name: 'headlines', muted: false}]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleClickRemoveSection: (section, sections) => {
      dispatch(removeSection(section, sections))
    },
    handleClickToggleSection: (section, sections) => {
      dispatch(toggleSection(section, sections))
    },
    handleClickRemoveAllSections: (sections) => {
      sections.map((section) => dispatch(removeSection(section, sections)))
    }
  }
}

export const SectionList = ({ handleClickRemoveSection, handleClickToggleSection, handleClickRemoveAllSections, sections }) => {
  const deleteSweepSection = `delete: ${[].concat(sections).length}`
  return (
    <Fragment>
      <VerticalSpace/>
      <List subheader={<ListSubheader>Edit/Save Sections</ListSubheader>} >
        <ListItem key='addItem'>
          <ListItemIcon>
            <IconButton title={deleteSweepSection} onClick={() => { handleClickRemoveAllSections(sections, sections) }}>
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
                  handleClickRemoveSection(section, sections)
                }}
              />
              <span
                onClick={() => {
                  handleClickToggleSection(section, sections)
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
