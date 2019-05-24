import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';

const mapStateToProps = ({ selectedSection }) => {
  return {
    selectedSection: selectedSection
  }
}

export const Content = ({ selectedSection, ...rest}) => {
  const title = (selectedSection.id) ? `${selectedSection.id}` : 'All Sections'
  return (
    <Fragment>
      <br />
      <br />
      <br />
      <br />
      <br />
      {title}
    </Fragment>
  )
}

export default connect(mapStateToProps)(Content);
