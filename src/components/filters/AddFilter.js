import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { Add } from '@material-ui/icons'
import { addFilter, updateFilter, publishFilters} from '../../actions/filterActions'
import IconButton from '@material-ui/core/IconButton'

const mapStateToProps = ({filter, filters}) => {
  return {
    text: (!filter) ? '' : filter.text,
    filters: filters
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickAddFilter: (text, filters) => {
      const newFilter = {
        id: text,
        text: text,
        fields: [{id: "title", name: "title", muted: false}]
      }
      dispatch(addFilter(newFilter, filters))
      dispatch(updateFilter(''))
      const newFilters = Object.assign(filters.filter((filterItem) => filterItem.id !== newFilter.id).concat(newFilter))
      dispatch(publishFilters(newFilters))
    },
    handleInputChange: (evt) => {
      const text = evt.target.value
      dispatch(updateFilter(text))
    }
  }
}

const AddFilter = ({ handleClickAddFilter, handleInputChange, text, filters }) => {
  return (
    <Fragment>
      <IconButton title="add new filter" onClick={() => handleClickAddFilter(text, filters)} >
        <Add id='addFilter' />
      </IconButton>
      <TextField
        label='new filter word'
        id='textFieldFilter'
        onChange={handleInputChange}
        value={text}
        placeholder="Meow Mix"
      />
    </Fragment>
  )
}

AddFilter.propTypes = {
  handleClickAddFilter: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}
export default connect(mapStateToProps, mapDispatchToProps)(AddFilter)
