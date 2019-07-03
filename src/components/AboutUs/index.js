import React, { Fragment } from 'react'
import Typography from '@material-ui/core/Typography'
import VerticalSpace from '../VerticalSpace'
import DeveloperFundBitcoinAddress from './DeveloperFundBitcoinAddress'
import DeveloperFundProjectName from './DeveloperFundProjectName'

export const AboutUs = () => {
  return (
    <Fragment>
      <VerticalSpace/>
      <Typography>keep <DeveloperFundProjectName /> independent</Typography>
      <Typography>bitcoin address: <DeveloperFundBitcoinAddress /></Typography>
    </Fragment>
  )
}
export default AboutUs
