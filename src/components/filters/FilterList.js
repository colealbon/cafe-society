import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import AddFilter from './AddFilter'
import RemoveFilter from './RemoveFilter'
import { removeFilter, toggleFilter } from '../../actions/filterActions'
import { selectFilterSection } from '../../actions/filterSectionActions'
import { selectFilterField } from '../../actions/filterFieldActions'
import PublishToBlockstack from '../PublishToBlockstack'

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
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'

const mapStateToProps = ({ filters, sections, fields }) => {
  return {
    filters: filters,
    sections: sections,
    fields: fields
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
    handleClickSetFilterSection: (filter) => {
      dispatch(selectFilterSection(filter))
    },
    handleClickSetFilterField: (filter) => {
      dispatch(selectFilterField(filter))
    }
  }
}

export const FilterList = ({ handleClickRemoveFilter, handleClickToggleFilter, handleClickRemoveAllFilters, handleClickSetFilterSection, handleClickSetFilterField, filters, sections, fields}) => {
  const deleteSweepFilter = `delete: ${[].concat(filters).length}`
  return (
    <Fragment>
      <br />
      <br />
      <br />
      <br />
      <List subheader={<ListSubheader><PublishToBlockstack></PublishToBlockstack>Edit/Save Filters</ListSubheader>} >
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
                        onClick={() => handleClickSetFilterSection(Object.assign(
                          {"section": section},
                          filter
                        ))}
                      />
                      )
                    })
                  }
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                <Typography>apply only to fields:</Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                  {
                    fields.map((field) => {
                      return (<Chip
                        key={field.id}
                        color={(field.id == (filter.fields || [] ).filter((filterField) => filterField.id === field.id)
                          .map((filterField) => filterField.id)[0]) ? 'primary' : 'default'}
                        label={field.name}
                        onClick={() => handleClickSetFilterField(Object.assign(
                          {"field": field},
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
  handleClickSetFilterSection: PropTypes.func.isRequired,
  handleClickSetFilterField: PropTypes.func.isRequired,
  handleClickRemoveFilter: PropTypes.func.isRequired,
  handleClickToggleFilter: PropTypes.func.isRequired,
  handleClickRemoveAllFilters: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  sections: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterList)
