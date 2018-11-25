import React from 'react'
import { Redirect, Route, Switch } from 'dva/router'
import Pages from './pages'
import Orders from './orders'
import Tokens from './tokens'
import Account from './account'
import Markets from './tickers/Markets'
import MarketsSearch from './tickers/ListSearchTickers'
import MarketDetail from './tickers/Detail'
import Convert from './tokens/ConvertForm'
import PlaceOrder from './orders/PlaceOrderPage'
import UserCenter from './account/UserCenter'
import Notifications from './notifications/Notifications'
import ListTodos from './notifications/ListTodos'
import CommonModals from '../components/Modals'
import SignModals from './sign/Modals'
import storage from 'modules/storage'
import ScanQrcode from './scan/ScanContainer'

const UnLogged = ()=>{
  const isLogged =  !!(storage.wallet.getUnlockedAddress())
  if(isLogged){
    return <Redirect to="/dex" />
  }else{
    return (
      <Redirect to="/auth" />
    )
}
}
const Logged = (props)=>{
  const isLogged =  !!(storage.wallet.getUnlockedAddress())
  if(isLogged){
    return (
      <div>
        <Switch>
          <Route path={`/dex/entry`} exact component={Pages.Entry} />
          <Route path={`/dex/scan`} exact component={ScanQrcode} />
          <Route path={`/dex/home`} exact component={Pages.Home} />
          <Route path={`/dex/markets`} exact component={Markets} />
          <Route path={`/dex/markets/search/:type`} exact component={MarketsSearch} />
          <Route path={`/dex/markets/:market`} component={MarketDetail} />
          <Route path={`/dex/placeOrder`} exact component={PlaceOrder} />
          <Route path={`/dex/placeOrder/:market`} exact component={PlaceOrder} />
          <Route path={`/dex/usercenter`} component={UserCenter} />
          <Route path={`/dex/convert/:token`} component={Convert} />
          <Route path={`/dex/notifications`} component={Notifications} />
          <Route path={`/dex/todos`} exact component={ListTodos} />
          <Redirect from="/dex" to= {`/dex/home`} />
        </Switch>
        <CommonModals />
        <Orders.Modals />
        <Tokens.Modals />
        <Account.Modals />
        <SignModals />
      </div>
    )
  }else{
    return <Redirect to="/auth" />
  }
}

export default class Routes extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Switch>
        <Route path={`/dex`}  component={Logged} />
      </Switch>
    );
  }
}



