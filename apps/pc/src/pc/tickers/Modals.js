import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import ListMarketTickersPage from './ListMarketTickersPage'
function Modals(props) {
  return (
    <div>
      <Containers.Layers id="ListMarketTickers">
        <UiContianers.Drawer id="ListMarketTickers" position="left" style={{height:'100%',width:'25vw'}}>
          <ListMarketTickersPage />
        </UiContianers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals
