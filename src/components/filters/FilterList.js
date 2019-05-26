// https://material-ui.com/components/chips/
import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import AddFilter from './AddFilter'
import RemoveFilter from './RemoveFilter'
import { removeFilter, toggleFilter } from '../../actions/filterActions'
import IconButton from '@material-ui/core/IconButton'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'

import Chip from '@material-ui/core/Chip'

import Loading from '../Loading'

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
    }
  }
}

export const FilterList = ({ handleClickRemoveFilter, handleClickToggleFilter, handleClickRemoveAllFilters, publishFilters, filters, sections, ...rest}) => {
  const deleteSweepFilter = `delete: ${[].concat(filters).length}`
  // const classes = useStyles();
  // const [expanded, setExpanded] = React.useState(false);

  // const handleChange = panel => (event, isExpanded) => {
  //   setExpanded(isExpanded ? panel : false);
  // };
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
          <Loading />
        </ListItem>
        {filters.map((filter) => {
          return (
            <ListItem key={filter.id}>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      id="panel1bh-header"
                    >
                    <RemoveFilter
                      {...filter}
                      onClick={() => {
                        handleClickRemoveFilter(filter)
                      }}
                    />
                    <span
                      onClick={() => {
                        handleClickToggleFilter(filter)
                      }}
                      title={filter.muted ? `enable ${filter.text}` : `disable ${filter.text}` }
                    >
                      <Switch checked={!filter.muted} />
                    </span>
                    <ListItemText primary={filter.text}></ListItemText>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      {sections.map((section) => {
                        return (
                          <Chip key={section.id} label={section.name}></Chip>
                        )
                      })}
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

export default connect(mapStateToProps, mapDispatchToProps)(FilterList)
