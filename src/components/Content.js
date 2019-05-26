import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const mapStateToProps = ({ selectedSection }) => {
  return {
    selectedSection: selectedSection
  }
}

export const Content = ({ selectedSection }) => {
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

Content.propTypes = {
  selectedSection: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Content)
