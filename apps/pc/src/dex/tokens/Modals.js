import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Receive from './Receive'
import Convert from './ConvertForm'
import HelperOfEnable from './HelperOfEnable'
import HelperOfTokenActions from './HelperOfTokenActions'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="receiveToken">
          <UiContianers.Popups id="receiveToken" style={{height:'100%'}} className="h100">
            <Receive/>
          </UiContianers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfEnable">
          <UiContianers.Popups id="helperOfEnable">
            <HelperOfEnable />
          </UiContianers.Popups>
      </Containers.Layers>
      <Containers.Layers id="helperOfTokenActions">
          <UiContianers.Popups id="helperOfTokenActions">
            <HelperOfTokenActions />
          </UiContianers.Popups>
      </Containers.Layers>
      <Containers.Layers id="convertToken" >
        <UiContianers.Popups id="convertToken" style={{height:'100%'}} className="h100">
          <Convert />
        </UiContianers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
