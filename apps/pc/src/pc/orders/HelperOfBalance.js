import React from 'react'
import { connect } from 'dva'
import { Button } from 'antd-mobile'
import { Icon as WebIcon, Switch,Popover } from 'antd'
import routeActions from 'common/utils/routeActions'
import { getTokensByMarket } from 'modules/formatter/common'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import {toFixed } from 'LoopringJS/common/formatter'
import intl from 'react-intl-universal'
import HelperOfTokenActions from '../tokens/HelperOfTokenActions'

const HelperOfBalance = (props)=>{
  const {dispatch,pair,balance} = props
  const marketTokens = getTokensByMarket(pair)
  const showLayer = (payload={})=>{
    dispatch({
      type:'layers/showLayer',
      payload:{
        ...payload
      }
    })
  }
  const tokens = getTokensByMarket(pair)
  const relatedTokens = new Array()
  const balanceL = {
    symbol:tokens.left,
    name:tokens.left,
    ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:tokens.left, toUnit:true}),
  }
  const balanceR = {
    symbol:tokens.right,
    name:tokens.right,
    ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:tokens.right, toUnit:true})
  }
  relatedTokens.push(balanceL)
  relatedTokens.push(balanceR)
  if(tokens.right === 'WETH') {
    relatedTokens.push({
      symbol:'ETH',
      name:'ETH',
      ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:'ETH', toUnit:true})
    })
  }
  const gotoReceive = (payload)=>{
    if(window.WALLET){
      showLayer({id:'receiveToken',...payload})
    }else{
      showLayer({id:'authOfPC'})
    }
  }
  const showActions = (payload)=>{
    showLayer({id:'helperOfTokenActions',...payload})
  }

  const gotoConvert = (payload)=>{
    if(window.WALLET){
      showLayer({id:'convertToken',...payload})
    }else{
      showLayer({id:'authOfPC'})
    }
  }
  const gotoAll = (payload)=>{
    // TODO
    // routeActions.gotoPath('/dex/convert')
  }

  return (
    <div className="fs20">
      <table className="w-100 fs12">
        <thead>
          <tr className="">
            <th className="text-left zb-b-b pl15 pr15 pt5 pb5 font-weight-normal color-black-4 text-nowrap">{intl.get('common.token')}</th>
            <th className="text-left zb-b-b pl15 pr15 pt5 pb5 font-weight-normal color-black-4 text-nowrap">{intl.get('common.balance')}</th>
            <th hidden className="text-left zb-b-b pl15 pr15 pt5 pb5 font-weight-normal color-black-4 text-nowrap">交易授权</th>
            <th hidden className="text-left zb-b-b pl15 pr15 pt5 pb5 font-weight-normal color-black-4">{intl.get('helper_of_market_order.selling')}</th>
            <th className="text-right zb-b-b pl15 pr15 pt5 pb5 font-weight-normal color-black-4">{intl.get('common.actions')}</th>
          </tr>
        </thead>
        <tbody className="">
            {
              relatedTokens.map((token,index)=>
                <tr key={index} className="hover-default zb-b-b" onClick={()=>{}}>
                  <td className="pl15 pr15 pt10 pb10 color-black-2 text-left">
                    {token.symbol}
                    <span hidden className="color-black-3 ml5">{token.name}</span>
                  </td>
                  <td className="pl15 pr15 pt10 pb10 color-black-2 text-left">{toFixed(token.balance, 8)}</td>
                  <td hidden className="pl15 pr15 pt10 pb10 color-black-2 text-left">
                    {
                      token.symbol !== 'ETH' && index === 0 && <Switch size="small" loading={false} />
                    }
                    {
                      token.symbol !== 'ETH' && index === 1 && <Switch size="small" loading={false} checked={false} />
                    }
                  </td>
                  <td hidden className="pl15 pr15 pt10 pb10 color-black-2 text-left">0.00</td>
                  <td className="pl15 pr15 pt10 pb10 color-black-2 text-right text-nowrap align-middel h-100">
                    <div className="d-flex align-items-center justify-content-end w100 h100">
                      {
                           token.symbol === 'ETH' &&
                        <Button onClick={gotoConvert.bind(this,{token:"ETH"})} type="primary" className="fs12 h-25 lh-25 d-inline-block border-none bg-primary-light text-primary mr10" size="small">{intl.get('common.convert')}</Button>
                      }
                      {
                         token.symbol === 'WETH' &&
                        <Button onClick={gotoConvert.bind(this,{token:'WETH'})} type="primary" className="fs12 h-25 lh-25 d-inline-block border-none bg-primary-light text-primary mr10" size="small">{intl.get('common.convert')}</Button>
                      }
                      <Button onClick={gotoReceive.bind(this,{token:token.symbol})} type="primary" className="fs12 h-25 lh-25 d-inline-block border-none bg-primary-light text-primary" size="small">{intl.get('common.receive')}</Button>
                    </div>
                  </td>
                </tr>
              )
            }
        </tbody>
      </table>
    </div>
  )
}
export default connect(({
  placeOrder:{pair},
  sockets,
})=>({
  pair,balance:sockets.balance.items
}))(HelperOfBalance)





