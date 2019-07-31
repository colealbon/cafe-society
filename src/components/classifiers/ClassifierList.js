import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import VerticalSpace from '../VerticalSpace'
import RemoveClassifier from './RemoveClassifier'
import { removeClassifier, toggleClassifier } from '../../actions/classifierActions'

import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListSubheader from '@material-ui/core/ListSubheader'
import {DeleteSweep} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import JSONTree from 'react-json-tree'

const mapStateToProps = ({ classifiers }) => {
  return {
    classifiers: classifiers ? classifiers : []
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClickRemoveClassifier: (classifier, classifiers) => {
      dispatch(removeClassifier(classifier, classifiers))
    },
    handleClickToggleClassifier: (classifier, classifiers) => {
      dispatch(toggleClassifier(classifier, classifiers))
    },
    handleClickRemoveAllClassifiers: (classifiers) => {
      dispatch(removeClassifier(classifiers, classifiers))
    }
  }
}

export const ClassifierList = ({ handleClickRemoveClassifier, handleClickToggleClassifier, handleClickRemoveAllClassifiers, classifiers }) => {
  const deleteSweepClassifier = `delete: ${[].concat(classifiers).length}`
  return (
    <Fragment>
      <VerticalSpace/>
      <IconButton title={deleteSweepClassifier} onClick={() => {handleClickRemoveAllClassifiers(classifiers)}}>
        <DeleteSweep></DeleteSweep>
      </IconButton>
      <List subheader={<ListSubheader>Review/Delete Classifiers</ListSubheader>} >
        {classifiers.map((classifier) => {
          return (
            <ListItem key={classifier.id}>
              <ListItemIcon>
                <RemoveClassifier
                  {...classifier}
                  onClick={() => {
                    handleClickRemoveClassifier(classifier, classifiers)
                  }}
                />
              </ListItemIcon>
              {(classifier.bayesJSON) ? <Typography variant="h6" >{classifier.id}: <JSONTree hideRoot={true} data={JSON.parse(classifier.bayesJSON)} /></Typography> : ''} 
            </ListItem>
          )
        }).reverse()
        }
      </List>
    </Fragment>
  )
}

ClassifierList.propTypes = {
  handleClickRemoveClassifier: PropTypes.func.isRequired,
  handleClickRemoveAllClassifiers: PropTypes.func.isRequired,
  classifiers: PropTypes.array.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassifierList)
