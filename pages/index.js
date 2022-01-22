import { Web3Context } from '../context/Web3Context'
import Head from 'next/head'
import Header from '../components/Header'
import { useEffect, useContext } from 'react'
import { ellipseAddress, getChainData } from '../lib/utilities.js'

export const Home = () => {
  const { state, dispatch, connect, disconnect } = useContext(Web3Context)
  const { provider, web3Provider, address, chainId, web3Modal } = state

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, [connect])

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts)
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        })
      }

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId) => {
        window.location.reload()
      }

      const handleDisconnect = (error) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error)
        disconnect()
      }

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider, disconnect])

  const chainData = getChainData(chainId)

  return (
    <div className="container">
      <Header />
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        {address && (
          <div className="grid">
            <div>
              <p className="mb-1">Network:</p>
              <p>{chainData?.name}</p>
            </div>
            <div>
              <p className="mb-1">Address:</p>
              <p>{ellipseAddress(address)}</p>
            </div>
          </div>
        )}
      </header>

      <main>Main</main>
    </div>
  )
}

export default Home
