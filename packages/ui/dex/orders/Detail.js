import React from 'react'
import { Icon } from 'antd'
import { NavBar, NoticeBar } from 'antd-mobile'
import intl from 'react-intl-universal'
import { connect } from 'dva'
import routeActions from 'common/utils/routeActions'
import { OrderFm } from 'modules/orders/OrderFm'
import DetailFills from './DetailFills'
import Worth from 'modules/settings/Worth'

const OrderMetaItem = (props) => {
  const {label, value} = props
  return (
    <div className="row ml0 mr0 pt10 pb10 pl15 pr15 zb-b-b no-gutters align-items-center" style={{padding:'7px 0px'}}>
      <div className="col">
        <div className="fs14 color-black-2 text-left">{label}</div>
      </div>
      <div className="col-auto text-right">
        <div className="fs14 color-black-2 text-wrap text-left">{value}</div>
      </div>
    </div>
  )
}
const Tips = ()=>{
  return (
    <div>
      { false &&
      <NoticeBar onClick={routeActions.gotoPath.bind(this,'/dex/todos')} className="text-left t-error s-lg" icon={<Icon type="close-circle"/>} mode="link" marqueeProps={{ loop: true}} action={<span>Enable Order<Icon type="right" /></span>}>
        订单无法进行撮合
      </NoticeBar>
      }
      { false &&
      <NoticeBar onClick={routeActions.gotoPath.bind(this,'/dex/todos')} className="text-left t-error s-lg" icon={<Icon type="close-circle"/>} mode="link" marqueeProps={{ loop: true}} action={<span>Enable Order<Icon type="right" /></span>}>
        余额为0，订单无法进行撮合
      </NoticeBar>
      }
      {
        false &&
        <NoticeBar  onClick={routeActions.gotoPath.bind(this,'/dex/todos')} className="text-left t-error s-lg" icon={<Icon type="exclamation-circle"/>} mode="link" marqueeProps={{ loop: true}} action={<span>查看详情<Icon type="right" /></span>}>
          余额不足，订单无法全部被撮合
        </NoticeBar>
      }
      {
        false &&
        <NoticeBar  onClick={routeActions.gotoPath.bind(this,'/dex/todos')} className="text-left t-info s-lg" mode="link" marqueeProps={{ loop: true}} action={<span>查看日志<Icon type="right" /></span>}>
          该订单正在进行撮合
        </NoticeBar>
      }
      {
        false &&
        <NoticeBar  className="text-left t-info s-lg" icon={<Icon type="question-circle"/>} mode="link" marqueeProps={{ loop: true}} action={<span>查看原因<Icon type="right" /></span>}>
          为什么订单没有撮合成交？
        </NoticeBar>
      }
    </div>
  )
}
function OrderDetail(props) {
  const {orderDetail,dispatch} = props
  const {order} = orderDetail;
  if(!order){
    return null
  }
  const orderFm = new OrderFm(order);

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
  const orderStatus = (item) => {
    if (item.status === 'ORDER_OPENED') {
      return intl.get("order_status.opened")
    }
    if (item.status === 'ORDER_FINISHED') {
      return intl.get("order_status.completed")
    }
    if (item.status === 'ORDER_CANCELLED') {
      return intl.get("order_status.canceled")
    }
    if (item.status === 'ORDER_CUTOFF') {
      return intl.get("order_status.canceled")
    }
    if (item.status === 'ORDER_EXPIRE') {
      return intl.get("order_status.expired")
    }
    if (item.status === 'ORDER_PENDING') {
      return intl.get("order_status.pending")
    }
    if (item.status === 'ORDER_CANCELLING') {
      return intl.get("order_status.canceling")
    }
    if (item.status === 'ORDER_WAIT_SUBMIT_RING') {
      return intl.get("order_status.waiting")
    }
  }
  const tokens = orderFm.getTokens()
  return (
    <div className="bg-fill position-relative" style={{height:"100%"}}>
      <div className="position-absolute w-100" style={{zIndex:'1000'}}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={()=>hideLayer({id:'orderDetail'})}
          leftContent={[
            <span key='1' className=""><Icon type="close"/></span>,
          ]}
          rightContent={null && [
            <Icon key="1" type="question-circle-o"/>,
          ]}
        >
          <div className="color-black">{intl.get('order_detail.page_title')}</div>
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
      </div>
      <div className="pt45 pb30" style={{overflow:'auto', height:'100%'}}>
        <div className="bg-white mt10">
          <div className="fs16 color-black text-left pt10 pb10 pl15 zb-b-b">{intl.get('order_detail.order_status_title')}</div>
          <div className="" style={{borderRadius:'0rem'}}>
            <OrderMetaItem label={intl.get('order.status')} value={orderStatus(order)}/>
            <OrderMetaItem label={intl.get('order.filled')} value={`${orderFm.getFilledPercent()}%`}/>
          </div>
        </div>
        <div className="mt10 bg-white">
          <div className="fs16 color-black text-left pt10 pb10 pl15 zb-b-b">{intl.get('order_detail.order_basic_title')}</div>
          <div className="" style={{borderRadius:'0rem'}}>
            <OrderMetaItem label={intl.get('order.price')} value={
              <div>
                <span className="color-black-4 pr5"><Worth amount={orderFm.getPrice()} symbol={tokens.right}/></span> {orderFm.getPrice()} { tokens.right }
              </div>
            }/>
            <OrderMetaItem label={intl.get('common.sell')} value={orderFm.getSell()}/>
            <OrderMetaItem label={intl.get('common.buy')} value={orderFm.getBuy()}/>
            <OrderMetaItem label={intl.get('order.LRCFee')} value={orderFm.getLRCFee()}/>
            <OrderMetaItem label={intl.get('common.ttl')} value={orderFm.getValidTime()}/>
          </div>
        </div>
        <div className="mt10 bg-white">
          <div className="fs16 color-black text-left pt10 pb10 pl15 zb-b-b">{intl.get('order_detail.order_fills_title')}</div>
          <div className="bg-white" style={{borderRadius:'0rem'}}>
            <DetailFills order={order}/>
          </div>
        </div>
      </div>
    </div>
  )
}
export default connect()(OrderDetail)
