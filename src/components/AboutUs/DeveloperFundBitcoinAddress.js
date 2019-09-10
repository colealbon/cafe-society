import React, { Fragment } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ developerFund }) => {
  return {
    bitcoinAddress: developerFund.bitcoinAddress
  }
}

export const BitcoinAddress = ({bitcoinAddressOverride, bitcoinAddress, ...rest}) => {
  return (
    <Fragment>
    {bitcoinAddressOverride || bitcoinAddress}
    </Fragment>
  )
}

export default connect(mapStateToProps)(BitcoinAddress)