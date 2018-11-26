import React from 'react'
import { Redirect, Route, Switch } from 'dva/router'
import Pages from './pages'
import Markets from './tickers/Markets'
import MarketsSearch from 'ui/dex/tickers/ListSearchTickers'
import MarketDetail from 'ui/dex/tickers/Detail'
import Convert from './tokens/ConvertForm'
import PlaceOrder from './orders/PlaceOrderPage'
import OrdersModals from './orders/Modals'
import UserCenter from './account/UserCenter'
import ListTodos from './notifications/ListTodos'
import SettingsModals from './settings/Modals'
import SignModals from './sign/Modals'
import TokensModals from './tokens/Modals'
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
          <Route path={`/dex/scan`} exact component={ScanQrcode} />
          <Route path={`/dex/home`} exact component={Pages.Home} />
          <Route path={`/dex/markets`} exact component={Markets} />
          <Route path={`/dex/markets/search/:type`} exact component={MarketsSearch} />
          <Route path={`/dex/markets/:market`} component={MarketDetail} />
          <Route path={`/dex/placeOrder`} exact component={PlaceOrder} />
          <Route path={`/dex/placeOrder/:market`} exact component={PlaceOrder} />
          <Route path={`/dex/usercenter`} component={UserCenter} />
          <Route path={`/dex/todos`} exact component={ListTodos} />
          <Redirect from="/dex" to= {`/dex/home`} />
        </Switch>
        <OrdersModals />
        <TokensModals />
        <SignModals />
        <SettingsModals />
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




