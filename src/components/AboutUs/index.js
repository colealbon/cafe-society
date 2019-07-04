import React, { Fragment } from 'react'
import Typography from '@material-ui/core/Typography'
import VerticalSpace from '../VerticalSpace'
import DeveloperFundBitcoinAddress from './DeveloperFundBitcoinAddress'
import DeveloperFundProjectName from './DeveloperFundProjectName'
import Link from '@material-ui/core/Link';

export const AboutUs = () => {
  return (
    <Fragment>
      <VerticalSpace/>
      <Typography>developer profile: <Link href='https://debutapp.social/cole_albon.id'>Cole Albon</Link></Typography>
      <Typography>keep <DeveloperFundProjectName /> independent</Typography>
      <Typography>bitcoin address: <DeveloperFundBitcoinAddress /></Typography>
      <Typography>share the pie: <Link href='https://pietron.app/new?name=cafe-society.news&address=33nkpL1ANUU7kAv27be6FM4BA6RsS4ZegH'>Pietron</Link></Typography>
    </Fragment>
  )
}
export default AboutUs
