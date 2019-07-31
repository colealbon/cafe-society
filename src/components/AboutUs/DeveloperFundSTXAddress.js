import React, { Fragment } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ developerFund }) => {
  return {
    stxAddress: developerFund.stxAddress
  }
}

export const STXAddress = ({ stxAddress, ...rest}) => {
  return (
    <Fragment>
    {stxAddress}
    </Fragment>
  )
}

export default connect(mapStateToProps)(STXAddress)
