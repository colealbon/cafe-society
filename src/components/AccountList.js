import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'

const mapStateToProps = ({ accounts }) => {
  return {
    accounts: accounts
  }
}

export const AccountList = ({ accounts }) => {
  return (
    <Fragment>
      <br/>
      <br/>
      <br/>
      <br/>
      <List subheader={<ListSubheader>{(accounts.length > 0) ? 'Web 3 accounts' : 'log in with metamask to view account'}</ListSubheader>} >
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
AccountList.propTypes = {
  accounts: PropTypes.array.isRequired,
};
export default connect(mapStateToProps)(AccountList)
