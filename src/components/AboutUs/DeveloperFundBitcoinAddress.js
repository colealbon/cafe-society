import React, { Fragment } from 'react'
import { connect, useSelector } from "react-redux";

export const BitcoinAddress = () => {
  const developerFund = useSelector(state => state.developerfund)
  return (
    <Fragment>
    {developerFund.bitcoinAddress}
    </Fragment>
  )
}

export default connect(BitcoinAddress)
