import React from 'react'
import { Button, InputItem, List, SegmentedControl, Toast ,Modal} from 'antd-mobile'
import { Icon as WebIcon,Affix } from 'antd'
import { connect } from 'dva'
import { getTokensByMarket } from 'modules/formatter/common'
import { getDisplaySymbol, toBig,toNumber, toHex } from 'LoopringJS/common/formatter'
import intl from 'react-intl-universal'
import * as orderFormatter from 'modules/orders/formatters'
import moment from 'moment'
import config from 'common/config'
import Notification from 'LoopringUI/components/Notification'
import storage from 'modules/storage'
import Worth from 'modules/settings/Worth'

const Item = List.Item;

// 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
// https://github.com/ant-design/ant-design-mobile/issues/307
// https://github.com/ant-design/ant-design-mobile/issues/163
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  }
}
class PlaceOrderForm extends React.Component {


  componentDidMount(){
    const {marketcap,dispatch, placeOrder,lastPrice} = this.props;
    const {pair} = placeOrder;
    if (marketcap  && marketcap.length > 0 ) {
      const tokens = getTokensByMarket(pair)
      const currentPrice = orderFormatter.getMarketPrice(marketcap,tokens.left, tokens.right);
      let mPrice = currentPrice || lastPrice || 0
      if(pair) {
        const marketConfig = config.getMarketBySymbol(tokens.left, tokens.right)
        if(marketConfig) {
          mPrice = orderFormatter.formatPriceByMarket(mPrice, marketConfig)
        }
      }
        dispatch({type: 'placeOrder/priceChange', payload: {priceInput: mPrice}})
    }
  }
  componentWillReceiveProps(newProps) {
    const {marketcap,dispatch, placeOrder,lastPrice} = newProps;
    // const {pair,priceChanged} = placeOrder;
    const {pair,priceChanged,priceInput} = placeOrder;
    console.log('receive new props')
    if ((this.props.marketcap !== newProps.marketcap|| Number(priceInput) === 0) && newProps.marketcap.length > 0 && !priceChanged) {
    // if (newProps.marketcap.length > 0 && !priceChanged) {
      const tokens = getTokensByMarket(pair)
      const currentPrice = orderFormatter.getMarketPrice(marketcap,tokens.left, tokens.right);
      let mPrice = currentPrice || lastPrice || 0
      if(pair) {
        const marketConfig = config.getMarketBySymbol(tokens.left, tokens.right)
        if(marketConfig) {
          mPrice = orderFormatter.formatPriceByMarket(mPrice, marketConfig)
        }
      }
      if (!priceChanged && Number(priceInput) !== Number(mPrice) ) {
        dispatch({type: 'placeOrder/priceChange', payload: {priceInput: mPrice}})
      }

    }

  }

  render(){
    const {dispatch,placeOrder,marketcap,balance,preference,trading,lastPrice, pendingTx, gas} = this.props
    const gasPrice = toHex(toBig(gas.tabSelected === 'estimate' ? gas.gasPrice.estimate : gas.gasPrice.current))
    const {side,pair} = placeOrder
    const tokens = getTokensByMarket(pair)
    const marketConfig = config.getMarketBySymbol(tokens.left, tokens.right)
    const right = config.getTokenBySymbol(tokens.right)
    const amountPrecision = Math.max(0, right.precision - marketConfig.pricePrecision)
    let amount = placeOrder.amountInput
    let price = placeOrder.priceInput
    const submitEnable = orderFormatter.isValidAmount(price) && orderFormatter.isValidAmount(amount)
    const total = (Number(amount) > 0) && (Number(price) > 0) ? toBig(amount).times(toBig(price)).toString(10) : 0
    let sell = {}, buy = {}
    if(side === 'buy') {
      sell = {token : tokens.right}
      buy = {token : tokens.left}
    } else {
      sell = {token : tokens.left}
      buy = {token : tokens.right}
    }
    const showLayer = (payload={})=>{
      dispatch({
        type:'layers/showLayer',
        payload:{
          ...payload
        }
      })
    }
    const hideLayer = (payload={})=>{
      dispatch({
        type:'layers/hideLayer',
        payload:{
          ...payload
        }
      })
    }
    const sideChange = (e)=>{
      const side = e.nativeEvent.selectedSegmentIndex === 0 ? 'buy' : 'sell'
      dispatch({
        type:'placeOrder/sideChangeEffects',
        payload:{
          side
        }
      })
    }
    const amountChange = (value)=>{
      dispatch({
        type:'placeOrder/amountChange',
        payload:{
          amountInput:value
        }
      })
    }
    const priceChange = (value)=>{
      dispatch({
        type:'placeOrder/priceChangeEffects',
        payload:{
          price:value
        }
      })
    }
    const showAdvanceChange = (value)=>{
      dispatch({
        type:'placeOrder/showAdvanceChange',
        payload:{
          showAdvance:true
        }
      })
      showLayer({id:'helperOfAdvance'})
    }
    const toConfirm = async () => {
      if (!orderFormatter.isValidAmount(price)) {
        Toast.info(intl.get('common.invalid_item', {item: intl.get('common.price')}), 1, null, false);
        return
      }
      if (!orderFormatter.isValidAmount(amount)) {
        Toast.info(intl.get('common.invalid_item', {item: intl.get('common.amount')}), 1, null, false);
        return
      }
      if(price !== placeOrder.priceInput) {
        priceChange(price)
      }

      if(!balance || !marketcap) {
        Notification.open({
          message:intl.get('notifications.title.place_order_failed'),
          description:intl.get('notifications.message.failed_fetch_data_from_server'),
          type:'error'
        })
        return
      }
      const {pair} = placeOrder;
      const tokens = getTokensByMarket(pair)
      const currentPrice = orderFormatter.getMarketPrice(marketcap,tokens.left, tokens.right);
      let mPrice = currentPrice || lastPrice || 0
      if(pair) {
        const marketConfig = config.getMarketBySymbol(tokens.left, tokens.right)
        if(marketConfig) {
          mPrice = orderFormatter.formatPriceByMarket(mPrice, marketConfig)
        }
      }

      if(side === 'buy' && toNumber(price) > 1.05 * toNumber(mPrice)){
        Modal.alert(intl.get('notifications.title.place_order_price_confirm'),
          intl.get('notifications.message.place_order_price_high'),[
          { text: intl.get('common.cancel'), onPress: () => {} },
          { text: intl.get('common.ok'), onPress: () => submitOrder() },
        ])
      }else if(side === 'sell' && toNumber(price) < 0.95 * toNumber(mPrice)){
        Modal.alert(intl.get('notifications.title.place_order_price_confirm'),
          intl.get('notifications.message.place_order_price_low'),[
            { text: intl.get('common.cancel'), onPress: () => {} },
            { text: intl.get('common.ok'), onPress: () => submitOrder() },
          ])
      }else{
        submitOrder()
      }
    }

    const submitOrder = async () => {
      const total = toBig(price).times(amount)
      const totalWorth = orderFormatter.calculateWorthInLegalCurrency(marketcap, tokens.right, total)
      if(!totalWorth.gt(0)) {
        Notification.open({
          message:intl.get('notifications.title.place_order_failed'),
          description:intl.get('notifications.message.failed_fetch_data_from_server'),
          type:'error'
        })
        return
      }
      const tradeInfo = {}
      tradeInfo.amountB = toBig(toBig(side.toLowerCase() === 'buy' ? amount : total))
      tradeInfo.amountS = toBig(side.toLowerCase() === 'sell' ? amount : total)
      tradeInfo.tokenB = buy.token
      tradeInfo.tokenS = sell.token
      try {
        await orderFormatter.p2pVerification(balance, tradeInfo, pendingTx ? pendingTx.items : [], gasPrice)
      } catch (e) {
        Toast.fail(e.message, 3, null, false);
        this.setState({submitLoading:false})
        return
      }
      if (tradeInfo.error && tradeInfo.error.length > 0) {
        tradeInfo.error.forEach(item => {
          switch (item.type) {
            case 'BalanceNotEnough':
              Toast.fail(intl.get('p2p_order.frozen_balance_not_enough', {
                frozen: item.value.frozen,
                require: item.value.required,
                token: item.value.symbol
              }), 8, null, false);
              break;
            case 'AllowanceNotEnough':
              Toast.fail(intl.get('p2p_order.p2p_allowance_not_enough', {token: item.value.symbol}), 8, null, false);
              break;
          }
        })
      } else {
        const validSince = moment().subtract(1, 'hours')
        const validUntil = moment().add(1, 'months')
        dispatch({type:'ttl/validTimeChange', payload:{validSince, validUntil}})
        showLayer({id:'placeOrderSteps'})
      }
    }

    const showAmountHelper = () => {
      if(side === 'buy') {
        if(Number(price) > 0) {
          showLayer({id:'helperOfAmount',side:'sell'})
        } else {
          Toast.info(intl.get('common.invalid_item', {item: intl.get('common.price')}), 1, null, false);
        }
      } else {
        showLayer({id:'helperOfAmount',side:'sell'})
      }
    }
    const menu1 = `${intl.get("common.buy")} ${tokens.left}`
    const menu2 = `${intl.get("common.sell")} ${tokens.left}`
    return (
      <div>
        <div className="bg-white p15">
          <div className="segmented-fs16">
            <SegmentedControl
              values={[menu1, menu2]}
              style={{height:'4rem'}}
              className={`m-auto side-${side}`}
              selectedIndex={side === 'buy' ? 0 : 1}
              onChange={sideChange}
            />
          </div>
          <List className="no-border am-list-bg-none selectable">
            <InputItem
              type="money"
              placeholder={`0.${'0'.repeat(marketConfig.pricePrecision)}`}
              value={price ? price : null}
              clear={false}
              moneyKeyboardAlign="left"
              moneyKeyboardWrapProps={moneyKeyboardWrapProps}
              className="circle h-default mt15"
              extra={
                <div className="fs14 cursor-pointer color-black-3 zb-b-l d-flex align-items-center justify-content-center" style={{width:'6.5rem',position:'absolute',right:0,top:'0',bottom:'0',margin:'auto'}} >
                  <span className="color-black-3 d-inline-block">{tokens.right}</span>
                  <div className="text-primary text-right pr10 text-nowrap" style={{position:'absolute',top:'1rem',width:'7rem',marginLeft:'-7rem'}}>
                    {
                      price>0 && <span className="color-black-4 fs12">≈ <Worth amount={price} symbol={tokens.right}/></span>
                    }
                  </div>
                </div>
              }
              onChange={priceChange}
            ><div className="fs14 color-black-3 pr5" style={{width:'50px'}}>{intl.get("common.price")}</div></InputItem>
            <InputItem
              type="money"
              placeholder={amountPrecision > 0 ? `0.${'0'.repeat(amountPrecision)}` : '0'}
              value={amount ? amount : null}
              clear={false}
              onChange={amountChange}
              moneyKeyboardAlign="left"
              moneyKeyboardWrapProps={moneyKeyboardWrapProps}
              className="circle h-default mt15"
              extra={
                <div className="fs14 cursor-pointer color-black-3 zb-b-l d-flex align-items-center justify-content-center" style={{width:'6.5rem',position:'absolute',right:0,top:'0',bottom:'0',margin:'auto'}} >
                  <span className="color-black-3 d-inline-block">{tokens.left}</span>
                  <div onClick={showAmountHelper} className="text-primary cursor-pointer text-right pr10 text-nowrap" style={{position:'absolute',top:'1rem',width:'3rem',left:'-3rem'}}>
                    <WebIcon className="text-primary fs14" type="sliders"/>
                  </div>
                </div>
              }
            ><div className="fs14 color-black-3 pr5" style={{width:'50px'}}>{intl.get("common.amount")}</div></InputItem>
            {
              false &&
              <List.Item
                className="mt0 mb0"
                arrow={false}
                extra={
                  <div className="fs12" style={{width:'auto',textAlign:'right'}}>
                    <span className="color-black-4 ml5">{total ? total : '0.00'}</span>
                    <span className="color-black-4 d-inline-block ml5" style={{width:'35px'}}>{tokens.right}</span>
                  </div>
                }
              >
                <div className="">
                  <span className="d-inline-block mr5 fs12 color-black-4" style={{width:'50px'}}>{intl.get("common.total")}</span>
                </div>
              </List.Item>
            }
              <Button onClick={toConfirm} style={{height:'auto'}} className={`p10 border-none d-flex align-items-center justify-content-center w-100 d-block mt15 ${submitEnable ? " " : "t-light-bak"} ${side=='buy' ? 'bg-success' : 'bg-error'}`} type={"primary"} disabled={false && !submitEnable}>
               <div className="">
                 <div className="lh20 fs16">{intl.get(`common.${side}`)}  {amount>0 ? amount : null} {tokens.left} </div>
                 {
                  total>0 &&
                   <div className="fs12 lh10" style={{opacity:'0.6',paddingTop:'0.5rem'}}>
                     <span className="mr5" style={{textTransform:'capitalize'}}>{intl.get('common.total')} :</span>
                     {total} {tokens.right}
                   </div>
                 }
               </div>
              </Button>
              {
                false && side === 'sell' &&
                <Button onClick={toConfirm} className={`w-100 d-block mt15 fs16 ${submitEnable ? " " : "t-light-bak"}`} type={"primary"} disabled={false}>
                  <div className="row ml0 mr0 no-gutters">
                    <div className="col">{amount ? amount : 0} {tokens.left}</div>
                    <div className="col-auto" style={{background:'rgba(0,0,0,0.05)',padding:'0 1.2rem'}}>→</div>
                    <div className="col">{intl.get('common.total')} {total} {tokens.right}</div>
                  </div>
                </Button>
              }
              {
                false && side === 'buy' &&
                <Button onClick={toConfirm} className={`w-100 d-block mt15 fs16 ${submitEnable ? " " : "t-light-bak"}`} type={"primary"} disabled={false}>
                  <div className="row ml0 mr0 no-gutters">
                    <div className="col">{total} {tokens.right}</div>
                    <div className="col-auto" style={{background:'rgba(0,0,0,0.05)',padding:'0 1.2rem'}}>→</div>
                    <div className="col">{amount ? amount : 0} {tokens.left}</div>
                  </div>
                </Button>
              }
          </List>
        </div>
        <div className="divider 1px zb-b-t"></div>
      </div>
    )
  }


}
export default connect(({
  placeOrder,
  sockets:{tickers, balance, marketcap},
  settings:{preference,trading},
  pendingTx,
  gas
})=>({
  placeOrder,
  lastPrice:tickers.item.loopr ? tickers.item.loopr.last : null,
  balance:balance.items ? balance.items : null,
  marketcap:marketcap.items ? marketcap.items : null,
  preference,trading,
  pendingTx:pendingTx,
  gas:gas,
}))(PlaceOrderForm)







