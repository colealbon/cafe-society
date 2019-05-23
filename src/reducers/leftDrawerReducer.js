import {
    LEFT_DRAWER_OPEN,
    LEFT_DRAWER_CLOSE
} from '../actions/leftDrawerActions'

export default (state = {open: false}, action) => {

  switch (action.type) {

    case LEFT_DRAWER_OPEN:
      return {open: true}

    case LEFT_DRAWER_CLOSE:
      return {open: false}

    default:
        return state
  }
}
