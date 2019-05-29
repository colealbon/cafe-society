import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { Add } from '@material-ui/icons'
import { addFilter, updateFilter} from '../../actions/filterActions'
import IconButton from '@material-ui/core/IconButton'

const mapStateToProps = ({filter}) => {
  if (!filter) {
    return {text: ''}
  }
  return {
    text: filter.text
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickAddFilter: (text) => {
      dispatch(addFilter({
        id: text.toLowerCase().replace(' ', '-'),
        text: text
      }))
      dispatch(updateFilter(''))
    },
    handleInputChange: (evt) => {
      const text = evt.target.value
      dispatch(updateFilter(text))
    }
  }
}

const AddFilter = ({ handleClickAddFilter, handleInputChange, text }) => {
  return (
    <Fragment>
      <IconButton title="add new filter" onClick={() => handleClickAddFilter(text)} >
        <Add id='addFilter' />
      </IconButton>
      <TextField
        id='textFieldFilter'
        onChange={handleInputChange}
        value={text}
        placeholder="Craig Wright"
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
