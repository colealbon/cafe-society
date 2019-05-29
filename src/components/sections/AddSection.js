import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import { Add } from '@material-ui/icons'
import { addSection, updateSection} from '../../actions/sectionActions'
import IconButton from '@material-ui/core/IconButton'

const mapStateToProps = ({section}) => {
  if (!section) {
    return {name: ''}
  }
  return {
    name: section.name
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickAddSection: (name) => {
      dispatch(addSection(name))
      dispatch(updateSection(''))
    },
    handleInputChange: (evt) => {
      const name = evt.target.value
      dispatch(updateSection(name))
    }
  }
}

const AddSection = ({ handleClickAddSection, handleInputChange, name, ...rest}) => {
  return (
    <Fragment>
      <IconButton title="add new rss section" onClick={() => handleClickAddSection(name)} >
        <Add id='addSection' />
      </IconButton>
      <TextField
        id='textFieldSection'
        onChange={handleInputChange}
        value={name}
        label="new section name"
        placeholder="Travel"
      />
    </Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSection)
