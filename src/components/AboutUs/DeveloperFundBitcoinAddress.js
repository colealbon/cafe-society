import React, { Fragment } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ developerFund }) => {
  return {
    bitcoinAddress: developerFund.bitcoinAddress
  }
}

export const BitcoinAddress = ({ bitcoinAddress, ...rest}) => {
  return (
    <Fragment>
    {bitcoinAddress}
    </Fragment>
  )
}

export default connect(mapStateToProps)(BitcoinAddress)
