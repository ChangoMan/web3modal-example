import { createContext } from 'react'

function MyApp({ Component, pageProps }) {
  const AppContext = createContext()
  const wallet = {
    provider: null,
    web3Provider: null,
    address: null,
    chainId: null,
  }

  return (
    <AppContext.Provider
      value={{
        state: { wallet },
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  )
}

export default MyApp
