import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import OrderDetail from 'ui/dex/orders/Detail'
import PlaceOrderSteps from './PlaceOrderSteps'
import HelperOfAmount from 'ui/dex/orders/HelperOfAmount'
import HelperOfMarket from 'ui/dex/orders/HelperOfMarket'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="orderDetail">
        <UiContainers.Popups id="orderDetail" className="h-100" style={{height:'100%'}}>
          <OrderDetail />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="placeOrderSteps">
        <UiContainers.Popups id="placeOrderSteps">
          <PlaceOrderSteps />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfAmount">
        <UiContainers.Popups id="helperOfAmount">
          <HelperOfAmount />
        </UiContainers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfMarket">
        <UiContainers.Popups id="helperOfMarket">
          <HelperOfMarket />
        </UiContainers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
