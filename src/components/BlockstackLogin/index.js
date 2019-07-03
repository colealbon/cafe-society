import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { loginWithBlockstack } from '../../actions/blockstackUserActions'

const mapDispatchToProps = (dispatch) => {
  return {
    handleLoginWithBlockstack: () => {
        dispatch(loginWithBlockstack())
      }
  }
}

const BlockstackLogin = ({handleLoginWithBlockstack}) => {
    return (
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleLoginWithBlockstack()}
      >Sign in with Blockstack
      </Button>
    )
}

export default connect(mapDispatchToProps)(BlockstackLogin)
