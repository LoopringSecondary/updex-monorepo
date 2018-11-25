import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import OrderDetail from 'ui/dex/orders/Detail'
import PlaceOrderSteps from './PlaceOrderSteps'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="orderDetail">
        <UiContainers.Drawer position="right" id="orderDetail" showMask={true} level={null} width="27.5rem" style={{height:'100%'}}>
          <OrderDetail />
        </UiContainers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="placeOrderSteps" >
        <UiContainers.Drawer position="right" wrapperClassName="orderConfirm" id="placeOrderSteps" level={'all'} width="32.5rem" style={{margin:'0 auto',height:'100%'}}>
          <PlaceOrderSteps />
        </UiContainers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals
