import React, { Fragment } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ developerFund }) => {
  return {
    projectName: developerFund.projectName
  }
}

export const ProjectName = ({projectNameOverride, projectName, ...rest}) => {
  return (
    <Fragment>
    {projectNameOverride || projectName}
    </Fragment>
  )
}

export default connect(mapStateToProps)(ProjectName)
