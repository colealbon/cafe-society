import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'

const mapStateToProps = ({ loading }) => {
  return {
    loading: loading
  }
}

export const Loading = ({ loading, ...rest}) => {

  return (
    <Fragment>
      {loading ? <IconButton><CircularProgress size={24} /></IconButton> : ''}
    </Fragment>
  )
}

export default connect(mapStateToProps)(Loading)
