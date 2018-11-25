import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Receive from 'ui/dex/tokens/Receive'
import Convert from './ConvertForm'
import HelperOfTokenActions from 'ui/dex/tokens/HelperOfTokenActions'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="receiveToken">
          <UiContianers.Drawer id="receiveToken" position="right" className="h100" style={{width:'27.5rem',margin:'0 auto',height:'100%'}}>
            <Receive/>
          </UiContianers.Drawer>
      </Containers.Layers>
      <Containers.Layers id="helperOfTokenActions">
          <UiContianers.Panels id="helperOfTokenActions" position="right"  className="rs h100" style={{width:'27.5rem',margin:'0 auto',height:'100%'}}>
            <HelperOfTokenActions />
          </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="convertToken" >
        <UiContianers.Drawer id="convertToken" closable={false} position="right" className="h100" style={{width:'27.5rem',margin:'0 auto',height:'100%'}}>
          <Convert />
        </UiContianers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals
