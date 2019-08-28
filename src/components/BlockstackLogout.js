import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import {Link} from 'react-router-dom'

const mapStateToProps = ({blockstackUser}) => {
  return {
      blockstackUser: blockstackUser
  }
}

const BlockstackLogout = ({blockstackUser}) => {
return (
    <Button
      variant="outlined"
      color="primary"
      component={Link}
      to='/logout'
    >Log out
    </Button>
  )
}

export default connect(mapStateToProps)(BlockstackLogout)

