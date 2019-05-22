import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';

const mapStateToProps = ({ accounts }) => {
  return {
    accounts: accounts
  }
}

export const AccountList = ({ accounts, ...rest}) => {
  return (
    <Fragment>
        {accounts.map((account) => {
          return (
            <Grid key={account}>
              <Typography>
              {account}
              </Typography>
              <p />
            </Grid>
          )
        })
      }
    </Fragment>
  )
}

export default connect(mapStateToProps)(AccountList);
