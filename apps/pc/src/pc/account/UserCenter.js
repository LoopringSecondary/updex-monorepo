import React from 'react'
import { NavBar, NoticeBar, Tabs } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { Link, Redirect, Route, Switch } from 'dva/router'
import Containers from 'modules/containers'
import routeActions from 'common/utils/routeActions'
import { OpenOrderList, PullRefreshOrders } from 'ui/dex/orders/ListOrders'
import ListBalance from 'ui/dex/tokens/ListBalance'
import { getShortAddress } from 'modules/formatter/common'
import storage from 'modules/storage'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import copy from 'copy-to-clipboard';
import Notification from 'LoopringUI/components/Notification'
import ListMyFills from 'ui/dex/fills/ListMyFills'

class UserCenter extends React.Component {
  render() {
    const {address,dispatch} = this.props
    const logout = () => {
      storage.wallet.clearUnlockedAddress()
      dispatch({type:"wallet/lock", payload:{}})
      dispatch({type:"placeOrderSteps/reset", payload:{}})
      dispatch({type:"layers/hideLayer", payload:{id:'usercenter'}})
      window.location.reload()
      // dispatch({type:"layers/showLayer", payload:{id:'authOfPC'}})
    }

    const copyToClipboard = () => {
      copy(address) ? Notification.open({description: intl.get('notifications.message.copy_success'),type: "success"}) : Notification.open({description: intl.get('notifications.message.copy_failed'),type: "error",})
    }

    return (
        <div className="bg-fill" style={{height:'100%',overflow:'auto'}}>
          <div className="bg-white position-absolute w-100" style={{zIndex:'1000'}}>
            <NavBar
                className="zb-b-b"
                mode="light"
                onLeftClick={()=>dispatch({type:'layers/hideLayer',payload:{id:'usercenter'}})}
                leftContent={[
                  <WebIcon type="close" className="fs14 color-black-1 text-primary cursor-pointer" />
                ]}
                rightContent={[
                  <WebIcon type="poweroff" className="fs14 circle-30 center-center bg-primary color-white hover-bg-primary cursor-pointer color-white" onClick={() => logout()} />
                ]}
            >
              <div className="text-center color-black">
                {intl.get('usercenter.page_title')}
              </div>
            </NavBar>
            <div className="1px divider zb-b-b"></div>
          </div>
          <div className="pt40 bg-white"></div>
          <div className="bg-white pt50 pb50 text-center">
            <div className="color-black-2 text-center fs16">{getShortAddress(address)}</div>
            <div className="text-center mt5">
              <span target="_blank" onClick={routeActions.gotoHref.bind(this,`https://etherscan.io/address/${address}`)} className="d-inline-block cursor-pointer fs12 lh25 pl10 pr10 bg-primary-light text-primary radius-circle">etherscan.io</span>
              <span target="_blank" className="d-inline-block cursor-pointer fs12 lh25 pl10 pr10 bg-primary-light text-primary radius-circle ml10" onClick={copyToClipboard}>{intl.get('address.copy')}</span>
            </div>
          </div>
          <div className="bg-white"><div className="divider 1px zb-b-t "></div></div>
          <div className="height-auto tabs-no-border">
            <Tabs
              tabs={
                [
                  { title: <div className={`pt5 pb5 fs16 d-block w-100 text-center`}>{intl.get('user_center.my_assets')}</div> },
                  { title: <div className={`pt5 pb5 fs16 d-block w-100 text-center`}>{intl.get('user_center.my_orders')}</div> },
                  { title: <div className={`pt5 pb5 fs16 d-block w-100 text-center`}>{intl.get('user_center.my_fills')}</div> },
                ]
              }
              initialPage={0}
              swipeable={false}
              onChange={(tab, index) => { console.log('onChange', index, tab); }}
              onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
            >
              <div>
                <div className="divider 1px zb-b-b"></div>
                <ListBalance />
              </div>
              <div>
                <div className="divider 1px zb-b-b"></div>
                <Containers.Orders id="MyOpenOrders" alias="orders" initstate={{}}>
                  <PullRefreshOrders />
                </Containers.Orders>
              </div>
              <div>
                <div className="divider 1px zb-b-b"></div>
                <Containers.Fills id="MyFills" alias="fills" initstate={{}}>
                  <ListMyFills />
                </Containers.Fills>
              </div>
            </Tabs>
            <div className="pb50"></div>
          </div>
          <div className="pb50"></div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    address:state.wallet.address
  }
}
export default connect(mapStateToProps) (UserCenter)





