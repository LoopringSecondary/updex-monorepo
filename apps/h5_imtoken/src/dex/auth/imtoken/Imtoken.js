import Wallet from 'common/wallets/wallet';
import config from './config'
import {toNumber,addHexPrefix} from 'LoopringJS/common/formatter'
import {keccakHash} from 'LoopringJS/common/utils'
import storage from 'modules/storage'


export default class Imtoken extends Wallet {

  constructor(imtoken) {
    super();
    this.imtoken = imtoken;
    this.walletType = 'imtoken'
  }
  getLanguage() {
    return new Promise((resolve) => {
      this.imtoken.callAPI('device.getCurrentLanguage', (error,result) => {
        let language = 'en-US'
        if(error){
          resolve({result:language})
        }else{
          if(result.indexOf('zh') !== -1){
            language = 'zh-CN'
          }
          resolve({result:language})
        }
      })
    })
  }

  getCurrency() {
    return new Promise((resolve) => {
      this.imtoken.callAPI('device.getCurrentCurrency', (error,result) => {
        let currency = 'USD'
        if(error){
          resolve({result:currency})
        }else{

          if(result === 'CNY'){
            currency = 'CNY'
          }
          resolve({result:currency})
        }
      })
    })
  }

  getLrcFee() {
    return new Promise((resolve) => {
      resolve({result:config.getLrcFeePercentage()})
    })
  }

  getCurrentAccount() {
    return new Promise((resolve) => {
      this.imtoken.callAPI('user.getCurrentAccount', function(err, address) {
        if(err) {
          resolve({error:err})
        } else {
          resolve({result:address})
        }
      })

    })
  }

  signMessage(message) {
    return new Promise((resolve) => {
      this.imtoken.callAPI('transaction.personalSign', {message:keccakHash(message),address:storage.wallet.getUnlockedAddress()}, (error,result) => {
        if(error){
          resolve({error})
        }else{
          const r = result.slice(0, 66);
          const s = addHexPrefix(result.slice(66, 130));
          const v = toNumber(addHexPrefix(result.slice(130, 132)));
          resolve({result:{r,s,v}})
        }
      })
    })
  }

  signTx(tx,feeCustomizable) {
    const imTx = {...tx};
    imTx.gas = tx.gasLimit;
    delete  imTx.gasLimit;
    imTx.from = storage.wallet.getUnlockedAddress()
    imTx.feeCustomizable = !!feeCustomizable
    return new Promise((resolve) => {
      this.imtoken.callAPI('transaction.signTransaction', imTx, (error,result) => {
        if(error){
          resolve({error})
        }else{
          resolve({result:addHexPrefix(result)})
        }
      })
    })
  }

  share(message){
    this.imtoken.callAPI('native.share', message)
  }

  scanQRCode(){
    return new Promise((resolve) => {
      this.imtoken.callAPI('native.scanQRCode', function (err, text) {
        if(err) {
          resolve({error:err})
        } else {
          resolve({result:text})
        }
      })
    })
  }

}


