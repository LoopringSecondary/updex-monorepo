import React from 'react'
import { Modal, List, Button, SearchBar,NavBar,Icon } from 'antd-mobile'
import { connect } from 'dva'
import intl from 'react-intl-universal'
import { sorterBySymbol, getBalanceBySymbol } from 'modules/tokens/TokensFm'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import {toFixed} from "LoopringJS/common/formatter"


class HelperOfTokens extends React.Component {

  state = {
    filter: ''
  }

  render () {
    const {helperOfTokens, p2pOrder, tokens, balance, dispatch} = this.props
    const {filter} = this.state
    const {side} = helperOfTokens
    const allTokens = tokens.map(item => {
      const tokenBalance = tokenFormatter.getBalanceBySymbol({balances: balance, symbol: item.symbol, toUnit: true})
      return {...item, ...tokenBalance}
    })
    const filterToken = side === 'buy' ? p2pOrder.tokenS : p2pOrder.tokenB
    let tokensList = [...allTokens].filter(item => item.symbol !== 'ETH' && item.symbol !== 'WETH_OLD' && item.symbol !== filterToken)
    if(filter){
      tokensList = tokensList.filter(item => item.symbol.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
    }

    tokensList.sort(sorterBySymbol)

    const hideLayer = (payload = {}) => {
      dispatch({
        type: 'layers/hideLayer',
        payload: {
          ...payload
        }
      })
    }

    function tokenChange (token) {
      if (side === 'buy') {
        dispatch({type: 'p2pOrder/tokenChange', payload: {'tokenB': token}})
      } else {
        dispatch({type: 'p2pOrder/tokenChange', payload: {'tokenS': token}})
      }
      hideLayer({id: 'helperOfTokens'})
    }

    const filterChange = (value) => {
      this.setState({filter:value})
    }

    return (
      <div className="bg-white" style={{height:'100%',overflow: 'auto'}}>
        <NavBar
          className="zb-b-b"
          mode="light"
          onLeftClick={() => hideLayer({id:'helperOfTokens'})}
          leftContent={[
            <span key='1' className=""><Icon type="cross"/></span>,
          ]}
        >
          <div className="color-black-1">{intl.get('token_list.select_token')}</div>
        </NavBar>
        <SearchBar placeholder={intl.get('token_list.search_token_holder')} className="selectable" maxLength={8} value={filter} onChange={filterChange}/>
        <div className="divider 1px zb-b-t"></div>
        <div className="no-border">
          <List className="">
            {
              tokensList.map((item, index) => {
                return (
                  <List.Item className="" key={index} arrow="horizontal" extra={<div className="color-black-3">{toFixed(item.balance,6)}</div>}
                             onClick={tokenChange.bind(this, item.symbol)}>
                    <div className="color-black-1">
                      <span className="d-inline-block text-center bg-primary-light text-primary circle fs14 mr5 " style={{width:'2.4rem',height:'2.4rem',lineHeight:'2.8rem'}}><i className={`icon icon-token-${item.symbol}`}></i></span>
                      {item.symbol}
                    </div>
                  </List.Item>
                )
              })
            }
          </List>
        </div>
      </div>
    )

  }

}

export default connect(({
                          sockets,
                          face2face,
                          p2pOrder,
                          tokens
                        }) => ({
  balance: sockets.balance.items,
  tokens: tokens.items,
  p2pOrder: p2pOrder
}))(HelperOfTokens)
