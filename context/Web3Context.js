import { createContext, useReducer } from 'react'

export const Web3Context = createContext()

const defaultState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return defaultState
    default:
      throw new Error()
  }
}

const Web3ContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, defaultState)

  return (
    <Web3Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Web3Context.Provider>
  )
}

export default Web3ContextProvider
