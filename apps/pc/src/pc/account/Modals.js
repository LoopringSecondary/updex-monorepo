import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import UserCenter from './UserCenter'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="usercenter">
        <UiContainers.Drawer position="right" id="usercenter" width="27.5vw"  style={{margin:'0 auto',height:'100%'}}>
          <UserCenter />
        </UiContainers.Drawer>
      </Containers.Layers>
    </div>
  )
}
export default Modals
