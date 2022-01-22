import { Web3Context } from '../context/Web3Context'
import { useContext } from 'react'

const Header = () => {
  const { state, connect, disconnect } = useContext(Web3Context)
  const { web3Provider } = state

  return (
    <header>
      <h1>Header</h1>
      {web3Provider ? (
        <button className="button" type="button" onClick={disconnect}>
          Disconnect
        </button>
      ) : (
        <button className="button" type="button" onClick={connect}>
          Connect
        </button>
      )}
    </header>
  )
}

export default Header
