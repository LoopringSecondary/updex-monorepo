import React from 'react'
import { Redirect, Route, Switch } from 'dva/router'
import Pages from './pages'
import Orders from './orders'
import Account from './account'
import TokensModals from './tokens/Modals'
import Markets from './tickers/Markets'
import MarketsSearch from './tickers/ListSearchTickers'
import MarketDetail from './tickers/Detail'
import Convert from './tokens/ConvertForm'
import PlaceOrder from './orders/PlaceOrderPage'
import UserCenter from './account/UserCenter'
import NotificationsModals from './notifications/Modals'
import ListTodos from './notifications/ListTodos'
import storage from 'modules/storage'


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
const Logged = ()=>{
  const isLogged =  !!(storage.wallet.getUnlockedAddress())
  if(isLogged){
    return (
      <div>
        <Switch>
          <Route path={`/dex/markets`} exact component={Markets} />
          <Route path={`/dex/markets/search/:type`} exact component={MarketsSearch} />
          <Route path={`/dex/markets/:market`} component={MarketDetail} />
          <Route path={`/dex/placeOrder`} exact component={PlaceOrder} />
          <Route path={`/dex/placeOrder/:market`} exact component={PlaceOrder} />
          <Route path={`/dex/usercenter`} component={UserCenter} />
          <Route path={`/dex/convert/:token`} component={Convert} />
          <Route path={`/dex/todos`} exact component={ListTodos} />
          <Route path={`/dex/messages`} exact component={Pages.Todo} />
          <Route path={`/dex/settings`} exact component={Pages.Todo} />
          <Redirect from="/dex" to="/dex/placeOrder" />
        </Switch>
        <Orders.Modals />
        <TokensModals />
        <Account.Modals />
        <NotificationsModals />
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




