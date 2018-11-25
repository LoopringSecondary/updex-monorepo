import React from 'react'
import {Link, Redirect, Route, Switch} from 'dva/router'
import AuthByLoopr from './loopr/AuthByLoopr'
import AuthByImtoken from './imtoken/AuthByImtoken'
import AuthByMock from './mock/AuthByMock'
import AuthByTPWallet from './tpwallet/AuthByTPWallet'
import Auth from './index.js'
import Privacy from './terms/Privacy'
import Terms from './terms/Terms'



const UnLogged = (props)=>{
    return (
      <Switch>
         <Route path={`/auth`} exact component={Auth} />
         <Route path={`/auth/mock`} exact component={AuthByMock} />
         <Route path={`/auth/loopr`} exact component={AuthByLoopr} />
         <Route path={`/auth/imtoken`} exact component={AuthByImtoken} />
         <Route path={`/auth/tpwallet`} exact component={AuthByTPWallet} />
         <Route path={`/auth/terms`} exact component={Terms} />
         <Route path={`/auth/privacy`} exact component={Privacy} />
       </Switch>
    )
}

export default class Routes extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Switch>
        <Route path={`/auth`}  component={UnLogged} />
      </Switch>
    );
  }
}




