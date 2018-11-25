import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import PCRoutes from './pc/routes';
import Face2FaceRoutes from './face2face/routes';
import SocketProvider from 'modules/sockets/Provider';
import Locales from 'modules//locales/container'



function RouterConfig({ history }) {
  return (
    <SocketProvider>
      <Locales>
        <Router history={history}>
          <div>
            <Face2FaceRoutes />
            <PCRoutes />
          </div>
        </Router>
      </Locales>
    </SocketProvider>
  )
}
export default RouterConfig;
