// https://material-ui.com/components/chips/
import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import AddFilter from './AddFilter'
import RemoveFilter from './RemoveFilter'
import { removeFilter, toggleFilter } from '../../actions/filterActions'
import { selectFilterSection } from '../../actions/filterSectionActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'

import Chip from '@material-ui/core/Chip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Switch from '@material-ui/core/Switch'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const mapStateToProps = ({ filters, sections }) => {
  return {
    filters: filters,
    sections: sections,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickRemoveFilter: (filter) => {
      dispatch(removeFilter(filter))
    },
    handleClickToggleFilter: (filter) => {
      dispatch(toggleFilter(filter))
    },
    handleClickRemoveAllFilters: (filters) => {
      filters.map((filter) => dispatch(removeFilter(filter)))
    },
    handleClickSetFilter: (filter) => {
      dispatch(selectFilterSection(filter))
    }
  }
}

export const FilterList = ({ handleClickRemoveFilter, handleClickToggleFilter, handleClickRemoveAllFilters, handleClickSetFilter, filters, sections}) => {
  const deleteSweepFilter = `delete: ${[].concat(filters).length}`
  return (
    <Fragment>
      <br />
      <br />
      <br />
      <br />
      <List subheader={<ListSubheader>Edit Filters</ListSubheader>} >
        <ListItem key='addItem'>
          <ListItemIcon><IconButton title={deleteSweepFilter} onClick={() => { handleClickRemoveAllFilters(filters) }}>
            <DeleteSweepIcon></DeleteSweepIcon>
          </IconButton></ListItemIcon>
          <AddFilter />
        </ListItem>
        {filters.map((filter) => {
          return (
            <ListItem key={filter.id}>
              <RemoveFilter
                {...filter}
                onClick={() => {
                  handleClickRemoveFilter(filter)
                }}
              />
              <span
                title={filter.muted ? `enable ${filter.text}` : `disable ${filter.text}` }
              >
                <Switch checked={!filter.muted} onClick={() => handleClickToggleFilter(filter)}/>
              </span>
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  id="panel1bh-header"
                >
                <ListItemText primary={filter.text}></ListItemText>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                <Typography>{(filter.muted) ? 'do not ' : ''}block articles containing {filter.text}</Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                <Typography>apply only to sections:</Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                  {
                    sections.map((section) => {
                      return (<Chip
                        key={section.id}
                        color={(section.id == (filter.sections || [] ).filter((filterSection) => filterSection.id === section.id)
                          .map((filterSection) => filterSection.id)[0]) ? 'primary' : 'default'}
                        label={section.name}
                        onClick={() => handleClickSetFilter(Object.assign(
                          {"section": section},
                          filter
                        ))}
                      />
                      )
                    })
                  }
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </ListItem>
          )
        }).reverse()
        }
      </List>
    </Fragment>
  )
}

FilterList.propTypes = {
  handleClickSetFilter: PropTypes.func.isRequired,
  handleClickRemoveFilter: PropTypes.func.isRequired,
  handleClickToggleFilter: PropTypes.func.isRequired,
  handleClickRemoveAllFilters: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  sections: PropTypes.array.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterList)
