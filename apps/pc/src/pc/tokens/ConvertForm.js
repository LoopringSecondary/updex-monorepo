import React from 'react'
import { Button, Icon, InputItem, List, NavBar, Toast,Modal } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { connect } from 'dva'
import routeActions from 'common/utils/routeActions'
import { toBig, toHex, toNumber } from 'LoopringJS/common/formatter'
import Contracts from 'LoopringJS/ethereum/contracts/Contracts'
import TokenFormatter, { getBalanceBySymbol, isValidNumber } from 'modules/tokens/TokenFm'
import config from 'common/config'
import intl from 'react-intl-universal'
import storage from 'modules/storage'
import Worth from 'modules/settings/Worth'
import { signTx } from 'common/utils/signUtils'
import ConvertHelperOfBalance from './ConvertHelperOfBalance'
import { keccakHash } from 'LoopringJS/common/utils'
import {HelperOfSignStepsModal} from '../sign/Modals'

const WETH = Contracts.WETH

class Convert extends React.Component {
  state = {
    token: 'ETH',
    loading: false,
    hash: ''
  }

  componentWillReceiveProps (newProps) {
    const {auth} = newProps
    const {hash} = this.state
    if (hash === auth.hash && auth.status === 'accept') {
      Modal.alert(intl.get('notifications.title.convert_suc'))
      this.setState({hash: ''})
    }
  }

  componentDidMount () {
    const {match} = this.props
    if (match && match.params && match.params.token) {
      this.setState({token: match.params.token})
    }
  }

  render () {
    const {dispatch, balance, amount, gas} = this.props
    const {token, loading} = this.state
    const address = storage.wallet.getUnlockedAddress()
    const assets = getBalanceBySymbol({balances: balance.items, symbol: token, toUnit: true})
    const other_assets = getBalanceBySymbol({balances: balance.items, symbol: token.toUpperCase() === 'ETH' ? 'WETH' : 'ETH', toUnit: true})
    const gasPrice = gas.tabSelected === 'estimate' ? gas.gasPrice.estimate : gas.gasPrice.current
    const gasLimit = token.toLowerCase() === 'eth' ? config.getGasLimitByType('deposit').gasLimit : config.getGasLimitByType('withdraw').gasLimit
    const tf = new TokenFormatter({symbol: token})
    const gasFee = toBig(gasPrice).times(gasLimit).div(1e9)
    const showLayer = (payload = {}) => {
      dispatch({
        type: 'layers/showLayer',
        payload: {
          ...payload
        }
      })
    }
    const hideLayer = (payload = {}) => {
      dispatch({
        type: 'layers/hideLayer',
        payload: {
          ...payload
        }
      })
    }
    const setGas = () => {
      showLayer({
        id: 'helperOfGas',
        gasLimit
      })
    }

    const setMax = () => {
      let max = assets.balance
      if (token === 'ETH') {
        max = toBig(assets.balance).minus(gasFee).minus(0.1).isPositive() ? toBig(assets.balance).minus(gasFee).minus(0.1) : toBig(0)
      }
      dispatch({type: 'convert/setMax', payload: {amount: max, amount1: max}})
    }
    const gotoConfirm = async () => {
      this.setState({loading: true})
      const _this = this
      if (!isValidNumber(amount)) {
        Toast.info(intl.get('notifications.title.invalid_number'), 1, null, false)
        this.setState({loading: false})
        return
      }
      const owner = storage.wallet.getUnlockedAddress()
      if (owner && ((token.toLowerCase() === 'eth' && toBig(amount).plus(gasFee).gt(assets.balance)) ||(token.toLowerCase() === 'weth' && toBig(amount).gt(assets.balance)))) {
        Toast.info(intl.get('convert.not_enough_tip', {token}), 1, null, false)
        this.setState({loading: false})
        return
      }
      let data = ''
      let value = ''
      if (token.toLowerCase() === 'eth') {
        data = WETH.encodeInputs('deposit')
        value = toHex(tf.getDecimalsAmount(amount))
      } else {
        data = WETH.encodeInputs('withdraw', {wad: toHex(tf.getDecimalsAmount(amount))})
        value = '0x0'
      }
      const to = config.getTokenBySymbol('WETH').address
      const tx = {
        gasLimit,
        data,
        to,
        gasPrice: toHex(toBig(gasPrice).times(1e9)),
        chainId: config.getChainId(),
        value
      }
      if (owner) {
        tx.nonce = toHex((await window.RELAY.account.getNonce(address)).result)
      }
      const unsign = [{type:'convert', data:tx}]
      dispatch({type: 'task/setTask', payload: {task:'convert', unsign}})
    }

    const amountChange = (value) => {
      dispatch({type: 'convert/amountChange', payload: {amount: value}})
    }
    const swap = () => {
      const {token} = this.state
      if (token.toLowerCase() === 'eth') {
        this.setState({token: 'WETH'})
      } else {
        this.setState({token: 'ETH'})
      }
    }
    const fromToken = token
    const toToken = token.toLowerCase() === 'eth' ? 'WETH' : 'ETH'
    return (
      <div className="bg-fill h-100 h100">
        <div className="bg-white">
          <NavBar
            className="zb-b-b"
            mode="light"
            onLeftClick={() => hideLayer({id: 'convertToken'})}
            leftContent={[
              <WebIcon type="close" key='1'/>,
            ]}
            rightContent={[
              <WebIcon className="cursor-pointer" onClick={swap} type="swap" />,
            ]}
          >
            <div className="color-black">{fromToken === 'ETH' ? intl.get('convert.convert_eth_title') : intl.get('convert.convert_weth_title')}</div>
          </NavBar>
          <div className="p15 ">
            <div className="row ml0 mr0 no-gutters align-items-stretch justify-content-center" style={{}}>
              <div className="col text-right no-border am-list-bg-none">
                <List className="selectable">
                  <InputItem
                    type="text"
                    onChange={amountChange}
                    value={amount>=0 ? amount : null}
                    extra={<div className="fs14 color-black-3 ml5">{fromToken}</div>}
                    className="circle h-default fs18"
                    placeholder={intl.get('common.amount')}
                  >
                    <div className="fs14 color-black-1">{intl.get('common.amount')}</div>
                  </InputItem>
                  <List.Item
                    className="circle h-default mt15 cursor-pointer"
                    arrow={false}
                    onClick={setGas}
                    extra={<div className="fs14 text-primary">
                      <Worth amount={gasFee} symbol='ETh'/> ≈ {tf.toPricisionFixed(toNumber(gasFee))}
                      <span className="color-black-3 ml10">ETH</span>
                    </div>}
                  >
                    <div className="fs14 color-black-1">{intl.get('common.gas')}</div>
                  </List.Item>
                </List>
              </div>
            </div>
            <Button className="b-block w-100 mt15" size="large" onClick={gotoConfirm} type="primary" loading={loading}
                    disabled={loading}>
              <div className="row ml0 mr0 no-gutters fs16 align-items-center">
                <div hidden className="col">{toNumber(tf.toPricisionFixed(toBig(amount)))} <span className="fs14">{fromToken}</span></div>
                <div className="col fs18" style={{}}>
                  {intl.get('common.convert')}
                </div>
                <div hidden className="col">{toNumber(tf.toPricisionFixed(toBig(amount)))} <span className="fs14">{toToken}</span></div>
              </div>
            </Button>
          </div>
        </div>
        <div className="divider zb-b-b 1px mb10"></div>
        <ConvertHelperOfBalance dispatch={dispatch} token={{symbol:token,balance:assets.balance,balance2:other_assets.balance}} gasFee={gasFee}/>
        <HelperOfSignStepsModal />
      </div>
    )
  }
}

function

mapStateToProps (state) {
  return {
    balance: state.sockets.balance,
    prices: state.sockets.marketcap.items,
    amount: state.convert.amount,
    gas: state.gas,
    auth: state.sockets.circulrNotify.item
  }
}

export default connect(mapStateToProps)(Convert)






