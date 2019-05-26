// https://medium.com/coinmonks/react-web-dapp-with-metamask-web3-sotp-part-4-f252ebe8d07f

export const FETCH_ACCOUNTS_REQUEST = 'FETCH_ACCOUNTS_REQUEST'
export const FETCH_ACCOUNTS_SUCCESS = 'FETCH_ACCOUNTS_SUCCESS'
export const FETCH_ACCOUNTS_ERROR = 'FETCH_ACCOUNTS_ERROR'

export const fetchAccounts = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_ACCOUNTS_REQUEST
    })

    const { web3 } = window
    const ethAccounts = getAccounts()

    if (ethAccounts == undefined) {
      web3 && web3.eth && web3.eth.getAccounts((err, accounts) => {
        if (err) {
          dispatch({
            type: FETCH_ACCOUNTS_ERROR,
            payload: err
          })
        } else {
          dispatch({
            type: FETCH_ACCOUNTS_SUCCESS,
            payload: accounts
          })
        }
      })
    } else {
      dispatch({
        type: FETCH_ACCOUNTS_SUCCESS,
        payload: ethAccounts
      })
    }
  }
}

function getAccounts () {
  try {
    const { web3 } = window
    return web3.eth.accounts
  } catch (e) {
    return []
  }
}
