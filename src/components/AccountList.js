import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'

const mapStateToProps = ({ accounts }) => {
  return {
    accounts: accounts
  }
}

export const AccountList = ({ accounts, ...rest}) => {
  return (
    <Fragment>
      <br/>
      <br/>
      <br/>
      <br/>
      <List subheader={<ListSubheader>Web 3 accounts</ListSubheader>} >
        {accounts.map((account) => {
          return (
            <ListItem key={account}>
              <ListItemText primary={account} />
            </ListItem>
          )
        })
        }
      </List>
    </Fragment>
  )
}

export default connect(mapStateToProps)(AccountList)
