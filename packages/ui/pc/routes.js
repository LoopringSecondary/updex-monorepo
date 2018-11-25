import React from 'react'
import { Redirect, Route, Switch } from 'dva/router'
import Pages from './pages'
import Orders from './orders'
import Tokens from './tokens'
import Account from './account'
import MarketModals from './tickers/Modals'
import AuthModals from './auth/Modals'
import SettingsModals from './settings/Modals'
import SignModals from './sign/Modals'
import P2PModals from '../face2face/Modals'
import NotificationModals from './notifications/Modals'
import Convert from './tokens/ConvertForm'
import PlaceOrder from './orders/PlaceOrderPage'
import UserCenter from './account/UserCenter'
import ListTodos from './notifications/ListTodos'
import CommonModals from './common/Modals'
import storage from 'modules/storage'
import UserAgent from 'common/utils/useragent'
import Heads from './common/Heads'

const UnLogged = ()=>{
  const isLogged = !!storage.wallet.getUnlockedAddress()
  if(isLogged){
    return <Redirect to="/dex" />
  }else{
    return (
      <Redirect to="/auth" />
    )
  }
}
const Logged = ()=>{
  // const isLogged =  !!storage.wallet.getUnlockedAddress()
  const isLogged = true
  const ua = new UserAgent()
  const isMobile = ua.isMobile()
  if(!isMobile){
    return (
      <div>
        <Switch>
          <Route path={`/trade/:market`} component={Pages.Trade} />
          <Redirect from="/" to="/trade/lrc-weth" />
        </Switch>
        <NotificationModals />
        <CommonModals />
        <MarketModals />
        <Orders.Modals />
        <Tokens.Modals />
        <Account.Modals />
        <P2PModals />
        <SignModals />
        <AuthModals />
        <SettingsModals />
        <Heads />
      </div>
    )
  }else{
    return <Redirect to="/dex" />
  }
}

export default class Routes extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Switch>
        <Route path={`/`} exact component={Logged} />
        <Route path={`/trade`} component={Logged} />
      </Switch>
    );
  }
}




