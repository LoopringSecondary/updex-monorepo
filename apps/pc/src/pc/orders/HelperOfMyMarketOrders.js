import React from 'react'
import {Button, Modal, NoticeBar, Toast} from 'antd-mobile'
import {Icon as WebIcon} from 'antd'
import {connect} from 'dva'
import intl from 'react-intl-universal'
import {OrderFm} from 'modules/orders/OrderFm'
import {getTokensByMarket} from 'modules/formatter/common'
import config from 'common/config'
import {toBig, toFixed} from 'LoopringJS/common/formatter'
import moment from 'moment'
import storage from 'modules/storage'
import TokenFm from 'modules/tokens/TokenFm'
import routeActions from 'common/utils/routeActions'

const HelperOfMyOrders = ({orders = {}, dispatch}) => {
  const market = orders.filters.market
  const tokens = getTokensByMarket(market)
  const gotoDetail = (item) => {
    dispatch({
      type: 'layers/showLayer',
      payload: {
        id: 'orderDetail',
        order: item,
      }
    })
  }


  const cancelOrderConfirm = (item) => {
    const tokenb = item.originalOrder.tokenB
    const tokens = item.originalOrder.tokenS
    let description = ''
    if (item.originalOrder.side.toLowerCase() === 'sell') {
      const tf = new TokenFm({symbol: tokens})
      description = `${intl.get('common.sell')} ${tf.toPricisionFixed(tf.getUnitAmount(item.originalOrder.amountS))} ${tokens}`
    } else {
      const tf = new TokenFm({symbol: tokens})
      description = `${intl.get('common.buy')} ${tf.toPricisionFixed(tf.getUnitAmount(item.originalOrder.amountB))} ${tokenb}`
    }
    Modal.alert(intl.get('order_cancel.cancel_title'), description, [
      {
        text: intl.get('order_cancel.confirm_no'), onPress: () => {
        }, style: 'default'
      },
      {
        text: intl.get('order_cancel.confirm_yes'), onPress: () => {
          const timestamp = Math.floor(moment().valueOf() / 1e3).toString()
          window.WALLET.signMessage(timestamp).then(res => {
            if (res.result) {
              const sig = res.result
              window.RELAY.order.cancelOrder({
                sign: {...sig, timestamp, owner: storage.wallet.getUnlockedAddress()},
                orderHash: item.originalOrder.hash,
                type: 1
              }).then(response => {
                if (response.error) {
                  Toast.fail(`${intl.get('notifications.title.cancel_fail', {type: intl.get('common.order')})}:${response.error.message}`, 3, null, false)
                } else {
                  Toast.success(intl.get('notifications.title.cancel_suc', {type: intl.get('common.order')}), 3, null, false)
                }
              })
            } else {
              Toast.fail(`${intl.get('notifications.title.cancel_fail', {type: intl.get('common.order')})}:${res.error.message}`, 3, null, false)
            }
          })
        }
      },
    ])
  }


  const cancelOrder = (item, e) => {
    e.stopPropagation()
    if (!window.WALLET || window.WALLET.getUnlockedType() === 'address') {
      window.jobCallback = () => {
        cancelOrderConfirm(item);
        delete  window.jobCallback;
      };
      dispatch({
        type: 'layers/showLayer',
        payload: {
          id: 'authOfPC',
        }
      })
    } else {
      cancelOrderConfirm(item)
    }
  }

  const cancelOrderByTokenPairConfirm = () => {
    if (orders.items && orders.items.find(item => item.status === "ORDER_OPENED")) {
      const openOrders = orders.items.filter(item => item.status === 'ORDER_OPENED')
      Modal.alert(intl.get('order_cancel.cancel_all_title', {market}), intl.get('order_cancel.cancel_all_mes', {
        amount: openOrders.length,
        market
      }), [
        {
          text: intl.get('order_cancel.confirm_no'), onPress: () => {
          }, style: 'default'
        },
        {
          text: intl.get('order_cancel.confirm_yes'), onPress: () => {
            const timestamp = Math.floor(moment().valueOf() / 1e3).toString()
            window.WALLET.signMessage(timestamp).then(res => {
              if (res.result) {
                const sig = res.result
                const tokens = market.split('-')
                const tokenS = config.getTokenBySymbol(tokens[0]).address
                const tokenB = config.getTokenBySymbol(tokens[1]).address
                window.RELAY.order.cancelOrder({
                  sign: {...sig, timestamp, owner: storage.wallet.getUnlockedAddress()},
                  type: 4,
                  tokenS,
                  tokenB
                }).then(response => {
                  if (response.error) {
                    Toast.fail(`${intl.get('notifications.title.cancel_fail', {type: intl.get('common.order')})}:${response.error.message}`, 3, null, false)
                  } else {
                    Toast.success(intl.get('notifications.title.cancel_suc', {type: intl.get('common.order')}), 3, null, false)
                  }
                })
              } else {
                Toast.fail(`${intl.get('notifications.title.cancel_fail', {type: intl.get('common.order')})}:${res.error.message}`, 3, null, false)
              }
            })
          }
        },
      ])
    } else {
      Toast.info(intl.get('order_cancel.no_open_orders'), 3, null, false)
    }
  }

  const cancelOrderByTokenPair = (e) => {
    e.stopPropagation();
    if (!window.WALLET || window.WALLET.getUnlockedType() === 'address') {
      window.jobCallback = () => {
        cancelOrderByTokenPairConfirm();
        delete  window.jobCallback;
      };
      dispatch({
        type: 'layers/showLayer',
        payload: {
          id: 'authOfPC',
        }
      })
    } else {
      cancelOrderByTokenPairConfirm();
    }
  };

  const orderStatus = (item) => {
    if (item.status === 'ORDER_OPENED') {
      return <Button onClick={cancelOrder.bind(this, item)} type="primary" style={{height: '24px', lineHeight: '24px'}}
                     className="d-inline-block ml5" size="small">{intl.get('common.cancel')}</Button>
    }
    if (item.status === 'ORDER_FINISHED') {
      return <span className="color-success"><WebIcon type="check-circle"/></span>
    }
    if (item.status === 'ORDER_CANCELLED') {
      return <span className="color-black-4">{intl.get("order_status.canceled")}</span>
    }
    if (item.status === 'ORDER_CUTOFF') {
      return <span className="color-black-4">{intl.get("order_status.canceled")}</span>
    }
    if (item.status === 'ORDER_EXPIRE') {
      return <span className="color-black-4">{intl.get("order_status.expired")}</span>
    }
    if (item.status === 'ORDER_PENDING') {
      return <span className="color-black-1">{intl.get("order_status.pending")}</span>
    }
    if (item.status === 'ORDER_CANCELLING') {
      return <span className="color-black-1">{intl.get("order_status.canceling")}</span>
    }
  }
  const gotoAll = () => {
  }
  return (
    <div className="">
      {false &&
      <NoticeBar onClick={routeActions.gotoPath.bind(this, '/dex/todos')} className="text-left t-error s-lg"
                 icon={<WebIcon type="close-circle"/>} mode="link" marqueeProps={{loop: true}}
                 action={<span>Enable Order<WebIcon type="right"/></span>}>
        订单无法进行撮合
      </NoticeBar>
      }
      {false &&
      <NoticeBar onClick={routeActions.gotoPath.bind(this, '/dex/todos')} className="text-left t-error s-lg"
                 icon={<WebIcon type="close-circle"/>} mode="link" marqueeProps={{loop: true}}
                 action={<span>Enable Order<WebIcon type="right"/></span>}>
        余额为0，订单无法进行撮合
      </NoticeBar>
      }
      {
        false &&
        <NoticeBar onClick={routeActions.gotoPath.bind(this, '/dex/todos')} className="text-left t-error s-lg"
                   icon={<WebIcon type="exclamation-circle"/>} mode="link" marqueeProps={{loop: true}}
                   action={<span>查看详情<WebIcon type="right"/></span>}>
          余额不足，订单无法全部被撮合
        </NoticeBar>
      }
      {
        false &&
        <NoticeBar onClick={routeActions.gotoPath.bind(this, '/dex/todos')} className="text-left t-info s-lg"
                   mode="link" marqueeProps={{loop: true}} action={<span>查看日志<WebIcon type="right"/></span>}>
          该订单正在进行撮合
        </NoticeBar>
      }
      {
        false &&
        <NoticeBar className="text-left t-info s-lg" icon={<WebIcon type="question-circle"/>} mode="link"
                   marqueeProps={{loop: true}} action={<span>查看原因<WebIcon type="right"/></span>}>
          为什么订单没有撮合成交？
        </NoticeBar>
      }
      <table className="w-100 fs12" style={{overflow: 'auto'}}>
        <thead>
        <tr className="">
          <th className="text-left pt5 pb5 pl10 pr5 font-weight-normal color-black-3 zb-b-b">
            {intl.get("common.side")}
            <span hidden className="color-black-4 ml5 fs10">{tokens.right}</span>
          </th>
          <th className="text-left pt5 pb5 pl5 pr5 font-weight-normal color-black-3 zb-b-b">
            {intl.get("common.price")}/{tokens.right}
          </th>
          <th className="text-left pt5 pb5 pl5 pr5 font-weight-normal color-black-3 zb-b-b">
            {intl.get("common.amount")}/{tokens.left}
          </th>
          <th hidden className="text-right pt5 pb5 pl5 pr5 font-weight-normal color-black-3 zb-b-b">Fee</th>
          <th
            className="text-left pt5 pb5 pl5 pr5 font-weight-normal color-black-3 zb-b-b">{intl.get('order.filled')}</th>
          <th className="text-center pl10 pr10 pt5 pb5 font-weight-normal color-black-3 zb-b-b text-nowrap">
            {
              orders.items && orders.items.length > 0 &&
              <Button onClick={cancelOrderByTokenPair.bind(this)} type="primary"
                      style={{height: '24px', lineHeight: '24px'}} className="d-inline-block ml5" size="small">
                {intl.get('common.cancel')}
              </Button>
            }
            {
              orders.items && orders.items.length === 0 && intl.get('common.status')
            }
          </th>
        </tr>
        </thead>
        <tbody>
        {
          orders.items && orders.items.map((item, index) => {
            const orderFm = new OrderFm(item)
            return (
              <tr key={index} className="color-black-2 hover-default" onClick={() => gotoDetail(item)}>
                <td className="pt10 pb10 pl10 pr5 text-left">
                  {orderFm.getSide() === 'buy' && <span className="color-success">{intl.get("common.buy")}</span>}
                  {orderFm.getSide() === 'sell' && <span className="color-error">{intl.get("common.sell")}</span>}
                </td>
                <td className="pt10 pb10 pl5 pr5 text-left">
                  {orderFm.getPrice()}
                </td>
                <td className="pt10 pb10 pl5 pr5 text-left text-nowrap">{orderFm.getAmount()}</td>
                <td hidden className="pt10 pb10 pl5 pr5 text-right text-nowrap">{orderFm.getLRCFee()}</td>
                <td className="pt10 pb10 pl5 pr5 text-left text-nowrap">{orderFm.getFilledPercent()}%</td>
                <td className="pt10 pb10 pl5 pr5 text-center">
                  {orderStatus(item)}
                </td>
              </tr>
            )
          })
        }
        {
          orders.items && orders.items.length === 0 &&
          <tr>
            <td className="zb-b-b pt10 pb10 pl5 pr5 text-center color-black-3 fs13" colSpan='100'>
              {intl.get("common.list.no_data")}
            </td>
          </tr>
        }
        </tbody>
      </table>
      <div className="">
        <div className="" onClick={routeActions.gotoPath.bind(this, '/dex/usercenter/orders')}>
          <div className="row color-black-3 fs13 ml0 mr0 no-gutters pl10 pr10 pt10 pb10 align-items-center">
            <div className="col text-center">
              <WebIcon className="mr5" type="exclamation-circle-o"/>
              <span>当前仅显示您的{market}订单</span>
              <span className="text-primary ml5">{intl.get('common.all')}</span>
            </div>
          </div>
        </div>
        <div className="divider 1px zb-b-t"></div>
      </div>
    </div>

  )
}

export default connect(({
                          sockets: {tickers, orders},
                        }) => ({
  orders
}))(HelperOfMyOrders)

