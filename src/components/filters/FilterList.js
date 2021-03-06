import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import AddFilter from './AddFilter'
import RemoveFilter from './RemoveFilter'
import VerticalSpace from '../VerticalSpace'
import { removeFilter, toggleFilter } from '../../actions/filterActions'
import { selectFilterSection } from '../../actions/filterSectionActions'
import { selectFilterField } from '../../actions/filterFieldActions'

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
    }],
    sections:  !!sections ? sections : [{id: 'headlines', name: 'headlines', muted: false}],
    fields: !!fields ? fields: [
      {id: 'title', name: 'title', muted: false},
      {id: 'link', name: 'link', muted: false},
      {id: 'contentSnippet', name: 'contentSnippet', muted: false}
    ]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickRemoveFilter: (filter, filters) => {
      dispatch(removeFilter(filter, filters))
    },
    handleClickToggleFilter: (filter, filters) => {
      dispatch(toggleFilter(filter, filters))
    },
    handleClickRemoveAllFilters: (filters) => {
      dispatch(removeFilter(filters, filters))
    },
    handleClickSetFilterSection: (filter, filters) => {
      dispatch(selectFilterSection(filter, filters))
    },
    handleClickSetFilterField: (filter, filters) => {
      dispatch(selectFilterField(filter, filters))
    }
  }
}

export const FilterList = ({ handleClickRemoveFilter, handleClickToggleFilter, handleClickRemoveAllFilters, handleClickSetFilterSection, handleClickSetFilterField, filters, sections, fields}) => {
  const deleteSweepFilter = `delete: ${[].concat(filters).length}`
  return (
    <Fragment>
      <VerticalSpace/>
      <List subheader={<ListSubheader>Edit/Save Filters</ListSubheader>} >
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
                  handleClickRemoveFilter(filter, filters)
                }}
              />
              <span
                title={filter.muted ? `enable ${filter.text}` : `disable ${filter.text}` }
              >
                <Switch checked={!filter.muted} onClick={() => handleClickToggleFilter(filter, filters)}/>
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
                        color={(section.id === (filter.sections || [] ).filter((filterSection) => filterSection.id === section.id)
                          .map((filterSection) => filterSection.id)[0]) ? 'primary' : 'default'}
                        label={section.name}
                        onClick={() => handleClickSetFilterSection(Object.assign(
                          {"section": section},
                          filter
                        ), filters)}
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
                        color={(field.id === (filter.fields || [] ).filter((filterField) => filterField.id === field.id)
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
