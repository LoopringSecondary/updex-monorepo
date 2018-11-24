import storage from 'modules/storage'
import Imtoken from 'mobile/auth/imtoken/Imtoken'
import Loopr from 'mobile/auth/loopr/loopr'
import Mock from 'mobile/auth/mock/mock'
import TPWallet from 'mobile/auth/tpwallet/TPWallet'

export function signMessage (message) {
  if (window.Wallet) {
    return window.Wallet.signMessage(message)
  }
  const walletType = storage.wallet.getUnlockedType()
  switch (walletType) {
    case 'imtoken':
      if (window.imToken) {
        window.Wallet = new Imtoken(window.imToken)
      }
      break
    case 'loopr':
      window.Wallet = new Loopr()
      break
    case 'tpwallet':
      window.Wallet = new TPWallet()
      break
    default :
      window.Wallet = new Mock()
  }
 return signMessage(message)
}

export async function signTx (tx, feeCustomizable) {
  if (window.Wallet) {
    return window.Wallet.signTx(tx, feeCustomizable)
  }
  const walletType = storage.wallet.getUnlockedType()
  switch (walletType) {
    case 'imtoken':
      if (window.imToken) {
        window.Wallet = new Imtoken(window.imToken)
      }
      break
    case 'loopr':
      window.Wallet = new Loopr()
      break
    case 'tpwallet':
      window.Wallet = new TPWallet()
      break
    default :
      window.Wallet = new Mock()
  }
 return signTx(tx, feeCustomizable)
}


export function signOrder (order) {
  if (window.Wallet) {
    return window.Wallet.signOrder(order)
  }
  const walletType = storage.wallet.getUnlockedType()
  switch (walletType) {
    case 'imtoken':
      if (window.imToken) {
        window.Wallet = new Imtoken(window.imToken)
      }
      break
    case 'loopr':
      window.Wallet = new Loopr()
      break
    case 'tpwallet':
      window.Wallet = new TPWallet()
      break
    default :
      window.Wallet = new Mock()
  }
  return signOrder(order)
}

export function share(content) {
  if (window.Wallet) {
    return window.Wallet.share(content)
  }
  const walletType = storage.wallet.getUnlockedType()
  switch (walletType) {
    case 'imtoken':
      if (window.imToken) {
        window.Wallet = new Imtoken(window.imToken)
      }
      break
    case 'loopr':
      window.Wallet = new Loopr()
      break
    case 'tpwallet':
      window.Wallet = new TPWallet()
      break
    default :
      window.Wallet = new Mock()
  }
  return signOrder(content)

}
