import AppContext from '../context/AppContext'
import { useContext } from 'react'

const Header = () => {
  const { state } = useContext(AppContext)

  return (
    <div>
      <h1>loo</h1>
      {/* <h1 className="title">Web3Modal Example</h1>
      {web3Provider ? (
        <button className="button" type="button" onClick={disconnect}>
          Disconnect
        </button>
      ) : (
        <button className="button" type="button" onClick={connect}>
          Connect
        </button>
      )} */}
    </div>
  )
}

export default Header
