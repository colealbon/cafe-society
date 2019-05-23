import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';

const mapStateToProps = ({ section }) => {
  return {
    section: section
  }
}

export const Content = ({ section, ...rest}) => {
  const title = (section.name) ? `${section.name}` : 'All Sections'
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
