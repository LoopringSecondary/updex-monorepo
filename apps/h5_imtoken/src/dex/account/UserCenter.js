import React from 'react'
import {connect} from 'dva'
import { NavBar, NoticeBar, Tabs } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { Link, Redirect, Route, Switch } from 'dva/router'
import Containers from 'modules/containers'
import routeActions from 'common/utils/routeActions'
import LayoutDexHome from '../../layout/LayoutDexHome'
import { OpenOrderList, PullRefreshOrders } from '../orders/ListOrders'
import ListBalance from 'ui/dex/tokens/ListBalance'
import ListMyFills from '../fills/ListMyFills'
import { getShortAddress } from 'modules/formatter/common'
import storage from 'modules/storage'
import intl from 'react-intl-universal'
import NumberOfTodos from 'ui/dex/notifications/NumberOfTodos'

class UserCenter extends React.Component {
  render() {
    const {match,location,dispatch} = this.props;
    const {url} = match;
    const {pathname} = location;
    const changeTab = (path) => {
      routeActions.gotoPath(`${url}/${path}`);
    }
    const isActive = (path) => {
      if(pathname === `${url}/${path}`){
        return true
      }
    }
    const showSettings = ()=>{
      dispatch({
        type:'layers/showLayer',
        payload:{
          id:'settings',
        }
      })
    }
    const showNotification = ()=>{
      dispatch({
        type:'layers/showLayer',
        payload:{
          id:'notifications',
        }
      })
    }
    const address = storage.wallet.getUnlockedAddress()
    return (
      <LayoutDexHome {...this.props}>
        <div className="0">
          <div className="bg-white position-fixed w-100" style={{zIndex:'1000'}}>
            <NavBar
                className="" 
                mode="light"
                onLeftClick={showNotification}
                leftContent={[
                  <NumberOfTodos key="1"><WebIcon type="bell" className="fs18" /></NumberOfTodos>
                ]}
                rightContent={[
                  <span className="" key="1" onClick={showSettings}><WebIcon type="setting" className="fs18" /></span>
                ]}
            >
              <div className="text-center color-black">
                {intl.get('usercenter.page_title')}
              </div>
            </NavBar>
            <div className="divider 1px zb-b-b"></div>
          </div>
          <div className="pt40 bg-white"></div>
          <div className="bg-white pt30 pb30 text-center">
            <div className="color-black-2 text-center fs16">{getShortAddress(address)}</div>
            <div className="text-center mt5">
              <span target="_blank" onClick={routeActions.gotoHref.bind(this,`https://etherscan.io/address/${address}`)} className="d-inline-block cursor-pointer fs12 lh25 pl10 pr10 bg-primary-light text-primary radius-circle">etherscan.io</span>
            </div>
          </div>
          <div className="bg-white"><div className="divider 1px zb-b-t "></div></div>
          <div className="height-auto tabs-no-border">
            <Tabs
              tabs={
                [
                  { title: <div onClick={changeTab.bind(this,'assets')} className={`pt5 pb5 fs16 d-block w-100 text-center ${isActive('assets') ? 'text-primary' : ''}`}>{intl.get('user_center.my_assets')}</div> },
                  { title: <div onClick={changeTab.bind(this,'orders')} className={`pt5 pb5 fs16 d-block w-100 text-center ${isActive('orders') ? 'text-primary' : ''}`}>{intl.get('user_center.my_orders')}</div> },
                  { title: <div onClick={changeTab.bind(this,'fills')} className={`pt5 pb5 fs16 d-block w-100 text-center ${isActive('fills') ? 'text-primary' : ''}`}>{intl.get('user_center.my_fills')}</div> },
                ]
              }
              initialPage={0}
              swipeable={false}
              onChange={(tab, index) => { console.log('onChange', index, tab); }}
              onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
            >
            </Tabs>
            <Switch>
              <Route path={`${url}/assets`} exact render={()=>{
                return (
                  <div className="zb-b-t">
                    <ListBalance />
                  </div>
                )
              }} />
              <Route path={`${url}/orders`} exact render={()=>{
                return (
                  <div className="zb-b-t">
                    <Containers.Orders id="MyOpenOrders" alias="orders" initstate={{}}>
                      <PullRefreshOrders />
                    </Containers.Orders>
                  </div>
                )
              }} />
              <Route path={`${url}/fills`} exact render={()=>{
                return (
                  <div>
                    <div className="divider 1px zb-b-b"></div>
                    <Containers.Fills id="MyFills" alias="fills" initstate={{}}>
                      <ListMyFills />
                    </Containers.Fills>
                  </div>
                )
              }} />
              <Redirect path={`${match.url}/`} to={`${match.url}/assets`}/>
            </Switch>
            <div className="pb50"></div>
          </div>
          <div className="pb50"></div>
        </div>
      </LayoutDexHome>

    );
  }
}
export default connect()(UserCenter)





