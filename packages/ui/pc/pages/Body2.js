import React from 'react';
import {connect} from 'dva'
import intl from 'react-intl-universal';
import Markets from '../tickers/Markets';
import PlaceOrderFormNoSide from '../orders/PlaceOrderFormNoSide';
import HelperOfDepth from '../orders/HelperOfDepth';
import HelperOfMyMarketOrders from 'mobile/orders/HelperOfMyMarketOrders';
import ListMarketFills from '../fills/ListMarketFills';
import HelperOfBalance from 'mobile/orders/HelperOfBalance';
import Kline from 'mobile/charts/Kline';
import Header from './Header'
import PanelHeader from './PanelHeader'
import PanelWrapper from './PanelWrapper'


class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    const {match,location} = this.props;
    return (
      <div style={{height:'100vh',overflow:'none'}} className="d-flex flex-column">
        <div className="d-flex flex-column mlpanel">
          <Header className="" />
        </div>
        <div className="row no-gutters" style={{flex:'1'}}>
          <div className="col d-flex flex-column" style={{flex:'1'}}>
            <PanelWrapper style={{flex:'1'}} className="mpanel mr0 mb0">
              <PanelHeader title={intl.get('pc_panels.charts')} />
              <Kline />
            </PanelWrapper>
          </div>
          <div className="col-auto d-flex flex-column mlpanel mtpanel">
            <div className="row no-gutters ml0 mr0" style={{flex:'1'}}>
              <div className="col-auto" style={{height:'100%'}}>
                <PanelWrapper style={{height:'100%',width:'24rem'}} className="">
                  <PanelHeader title={intl.get('pc_panels.order_book')}  />
                  <HelperOfDepth />
                </PanelWrapper>
              </div>
              <div className="col-auto" style={{height:'100%'}}>
                <PanelWrapper style={{height:'100%',width:'24rem'}} className="mlpanel">
                  <PanelHeader title={intl.get('pc_panels.trade_history')} />
                  <ListMarketFills />
                </PanelWrapper>
              </div>
            </div>
            <PanelWrapper className="mtpanel">
              <PanelHeader title={intl.get('pc_panels.place_order')} />
              <div className="row no-gutters ml0 mr0 mtpanel">
                <div className="col-auto" style={{width:'24rem'}}>
                  <PlaceOrderFormNoSide side="buy" location={location} match={match} />
                </div>
                <div className="col-6" style={{width:'24rem'}}>
                  <PlaceOrderFormNoSide side="sell" location={location} match={match} />
                </div>
              </div>
            </PanelWrapper>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
