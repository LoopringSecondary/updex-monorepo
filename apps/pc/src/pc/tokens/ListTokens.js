import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm} from 'modules/tickers/formatters'
import storage from 'modules/storage'
import intl from 'react-intl-universal'
import routeActions from 'common/utils/routeActions'
import { ListView,Button,Tabs,NavBar,Icon,SegmentedControl,Grid } from 'antd-mobile'
import { Switch,Icon as WebIcon,Badge} from 'antd'
import TokensFm from 'modules/tokens/TokensFm'

const TokenItem = ({item={},actions,key,index,collapsed,loading})=>{
    if(!item){ return null }
    return (
      <div className="row ml0 mr0 pt10 pb10 align-items-center justify-content-center no-gutters" onClick={()=>{}}>
        <div className="col-auto text-center pl10 pr10">
            <i className={`icon-token-${item.symbol} fs20 d-block m-auto bg-primary color-black-1`} style={{width:'3.6rem',height:'3.6rem',lineHeight:'3.6rem',borderRadius:'50em',background:"rgba(255,255,255,0)"}}></i>
        </div>
        <div className="col text-left" style={{display:collapsed ? 'none' : 'block'}}>
          <div>
            <div className="fs16 color-black-1">
              {item.symbol}
            </div>
            <div hidden className="fs14 color-black-3">
              {item.name}
            </div>
          </div>
        </div>
        <div className="col-auto text-right pr15" style={{display:collapsed ? 'none' : 'block'}}>
          <div className="color-black-3 fs16">
            {!loading && item.balance.toFixed(5)}
            {loading && <span className="fs12">Loading</span>}
          </div>
        </div>
      </div>
      
    )
}


const TokenListComp = (props)=>{
  const {tokens,balance,marketcap, dispatch,collapsed} = props
  const tokensFm = new TokensFm({tokens, marketcap, balance})
  const formatedTokens = tokensFm.getList()

  const showLayer = (payload={})=>{
    dispatch({
      type:'layers/showLayer',
      payload:{
        ...payload
      }
    })
  }
  const showReceive = (symbol) => {
    dispatch({type: 'layers/showLayer', payload: {id: 'receiveToken',symbol}});
  }

  const showConvert = (token) => {
    routeActions.gotoPath(`/dex/convert/${token}`)
    // dispatch({type: 'layers/showLayer', payload: {id: 'convertToken',token}});
  }
  const showActions = (symbol) => {
    dispatch({type: 'layers/showLayer', payload: {id: 'helperOfTokenActions',symbol,hideBuy:false}});
  }
  console.log("tokens",tokens)
  return (
    <div className="fs20">
      {
        formatedTokens.map((token,index)=>{
          return (
            <TokenItem item={token} key={index} collapsed={collapsed} loading={tokens.loading}/>
          )
        })
      }
    </div>
  )
}
export default connect(({
  sockets,
  tokens
}) => ({
  balance:sockets.balance,
  marketcap:sockets.marketcap,
  tokens
}))(TokenListComp)
