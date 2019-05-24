import React, { Fragment } from 'react'
import { connect } from 'react-redux'

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
      {title}
    </Fragment>
  )
}

export default connect(mapStateToProps)(Content);
