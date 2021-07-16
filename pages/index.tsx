import WalletConnectProvider from '@walletconnect/web3-provider'
import { providers } from 'ethers'
import Head from 'next/head'
import { useCallback, useEffect, useReducer } from 'react'
import Web3Modal from 'web3modal'
import { ellipseAddress, getChainData } from '../lib/utilities'

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: '460f40a260564ac4a4f4b3fffb032dad', // required
    },
  },
}

let web3Modal
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true,
    providerOptions, // required
  })
}

type StateType = {
  web3Provider?: any
  address?: string
  chainId?: number
}

type ActionType =
  | {
      type: 'SET_WEB3_PROVIDER'
      web3Provider?: StateType['web3Provider']
      address?: StateType['address']
      chainId?: StateType['chainId']
    }
  | {
      type: 'SET_ADDRESS'
      address?: StateType['address']
    }
  | {
      type: 'SET_CHAIN_ID'
      chainId?: StateType['chainId']
    }
  | {
      type: 'RESET_WEB3_PROVIDER'
    }

const initialState: StateType = {
  web3Provider: null,
  address: null,
  chainId: null,
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
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
      return initialState
    default:
      throw new Error()
  }
}

export const Home = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const connect = useCallback(async function () {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal.connect()

    if (!provider.on) {
      return
    }

    provider.on('accountsChanged', (accounts: string[]) => {
      // eslint-disable-next-line no-console
      console.log('accountsChanged', accounts)
      dispatch({
        type: 'SET_ADDRESS',
        address: accounts[0],
      })
    })

    // Subscribe to chainId change
    provider.on('chainChanged', async (chainId: string) => {
      // eslint-disable-next-line no-console
      console.log('chainChanged', chainId)
      const splitChainId = chainId.split('0x')
      const parsedChainId =
        splitChainId[1] === '2a' ? 42 : parseInt(splitChainId[1])
      dispatch({
        type: 'SET_CHAIN_ID',
        chainId: parsedChainId,
      })
    })

    // Subscribe to provider disconnection
    provider.on('disconnect', (error: { code: number; message: string }) => {
      // eslint-disable-next-line no-console
      console.log('disconnect', error)
      disconnect()
    })

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new providers.Web3Provider(provider)

    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()

    const network = await web3Provider.getNetwork()

    dispatch({
      type: 'SET_WEB3_PROVIDER',
      web3Provider,
      address,
      chainId: network.chainId,
    })
  }, [])

  async function disconnect() {
    await web3Modal.clearCachedProvider()
    dispatch({
      type: 'RESET_WEB3_PROVIDER',
    })
  }

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, [connect])

  const chainData = getChainData(state.chainId)

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        {state.address && (
          <div className="grid">
            <div>
              <p>Network:</p>
              <p>{chainData?.name}</p>
            </div>
            <div>
              <p>Address:</p>
              <p>{ellipseAddress(state.address)}</p>
            </div>
          </div>
        )}
      </header>

      <main>
        <h1 className="title">Web3Modal Example</h1>
        {state.web3Provider ? (
          <button className="button" type="button" onClick={disconnect}>
            Disconnect
          </button>
        ) : (
          <button className="button" type="button" onClick={connect}>
            Connect
          </button>
        )}
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          text-align: center;
        }

        p {
          margin-top: 0;
        }

        .container {
          padding: 2rem;
          margin: 0 auto;
          max-width: 1200px;
        }

        .grid {
          display: grid;
          grid-template-columns: auto auto;
          justify-content: space-between;
        }

        .button {
          padding: 1rem 1.5rem;
          background: ${state.web3Provider ? 'red' : 'green'};
          border: none;
          border-radius: 0.5rem;
          color: #fff;
          font-size: 1.2rem;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export default Home
