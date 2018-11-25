import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import HelperOfSignByThirdWallet from './HelperOfSignByThirdWallet'
function Modals(props) {
  return (
    <div>
      <Containers.Layers id="helperOfSign">
        <UiContainers.Popups id="helperOfSign">
          <HelperOfSignByThirdWallet />
        </UiContainers.Popups>
      </Containers.Layers>
    </div>
  )
}
export default Modals
