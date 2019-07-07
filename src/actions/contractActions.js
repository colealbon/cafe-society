// https://medium.com/coinmonks/react-web-dapp-with-metamask-web3-sotp-part-4-f252ebe8d07f

export const FETCH_ACCOUNTS_START = 'FETCH_ACCOUNTS_START'
export const FETCH_ACCOUNTS_SUCCESS = 'FETCH_ACCOUNTS_SUCCESS'
export const FETCH_ACCOUNTS_ERROR = 'FETCH_ACCOUNTS_ERROR'

export const fetchAccounts = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_ACCOUNTS_START
    })
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      ethereum.enable()
      .then(() => {
        dispatch({
          type: FETCH_ACCOUNTS_SUCCESS,
          payload: web3.eth.accounts
        })
      }).catch((error) => {
        dispatch({
          type: FETCH_ACCOUNTS_ERROR,
          payload: error
        })
      })
    }
  }
}