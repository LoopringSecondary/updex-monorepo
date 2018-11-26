import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import ListSearchTickers from 'ui/dex/tickers/ListSearchTickers'
function Modals(props) {
  return (
    <div>
      <Containers.Layers id="ListSearchTickers">
        <UiContianers.Popups id="ListSearchTickers" width="450px">
          <ListSearchTickers />
        </UiContianers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
