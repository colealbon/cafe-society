import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import VerticalSpace from './VerticalSpace'

const mapStateToProps = ({ accounts }) => {
  return {
    accounts: accounts
  }
}

export const AccountList = ({ accounts }) => {
  return (
    <Fragment>
      <VerticalSpace />
      <List subheader={<ListSubheader>{(accounts) ? 'Web 3 accounts' : 'log in with metamask to view account'}</ListSubheader>} >
        {accounts ? accounts.map((account) => {
          return (
            <ListItem key={account}>
              <ListItemText primary={account} />
            </ListItem>
          )
        }) : {}
        }
      </List>
    </Fragment>
  )
}
AccountList.propTypes = {
  accounts: PropTypes.array,
};
export default connect(mapStateToProps)(AccountList)
