import React from 'react'
import Containers from 'modules/containers'
import UiContainers from 'LoopringUI/containers'
import Settings from './Settings'
import SetLanguage from 'mobile/settings/SetLanguage'
import SetCurrency from 'mobile/settings/SetCurrency'
import SetLayout from './SetLayout'
import SetLRCFee from 'mobile/settings/SetLRCFee'
import SetTheme from 'mobile/settings/SetTheme'
import SetTTL from 'mobile/settings/SetTTL'
import SetIsDeveloper from 'mobile/settings/SetIsDeveloper'

export function SetLanguageModal(){
  return (
    <Containers.Layers id="setLanguage">
      <UiContainers.Drawer id="setLanguage" position="right" zIndex={1091} style={{margin:'0 auto',height:'100%',width:'27.5rem'}}>
        <SetLanguage />
      </UiContainers.Drawer>
    </Containers.Layers>
  )
}
export function SetIsDeveloperModal(){
  return (
    <Containers.Layers id="setIsDeveloper">
      <UiContainers.Drawer id="setIsDeveloper" position="right" zIndex={1091} style={{margin:'0 auto',height:'100%',width:'27.5rem'}}>
        <SetIsDeveloper />
      </UiContainers.Drawer>
    </Containers.Layers>
  )
}

export function SetCurrencyModal(){
  return (
    <Containers.Layers id="setCurrency">
      <UiContainers.Drawer id="setCurrency" position="right" zIndex={1091} style={{margin:'0 auto',height:'100%',width:'27.5rem'}}>
        <SetCurrency />
      </UiContainers.Drawer>
    </Containers.Layers>
  )
}
export function SetLayoutModal(){
  return (
    <Containers.Layers id="setLayout">
      <UiContainers.Drawer id="setLayout" position="right" zIndex={1091} style={{margin:'0 auto',height:'100%',width:'27.5rem'}}>
        <SetLayout />
      </UiContainers.Drawer>
    </Containers.Layers>
  )
}
export function SetLRCFeeModal(){
  return (
    <Containers.Layers id="setLRCFee">
      <UiContainers.Drawer id="setLRCFee" position="right" zIndex={1091} style={{margin:'0 auto',height:'100%',width:'27.5rem'}}>
        <SetLRCFee />
      </UiContainers.Drawer>
    </Containers.Layers>
  )
}
export function SetThemeModal(){
  return (
    <Containers.Layers id="setTheme">
      <UiContainers.Drawer id="setTheme" position="right" zIndex={1091} style={{margin:'0 auto',height:'100%',width:'27.5rem'}}>
        <SetTheme />
      </UiContainers.Drawer>
    </Containers.Layers>
  )
}
export function SetTTLModal(){
  return (
    <Containers.Layers id="setTTL">
      <UiContainers.Drawer id="setTTL" position="right" zIndex={1091} style={{margin:'0 auto',height:'100%',width:'27.5rem'}}>
        <SetTTL />
      </UiContainers.Drawer>
    </Containers.Layers>
  )
}

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="settings">
        <UiContainers.Drawer position="right" id="settings" zIndex={1090} level={null} style={{margin:'0 auto',height:'100%',width:'32.5rem'}}>
          <Settings />
        </UiContainers.Drawer>
      </Containers.Layers>
      <SetLanguageModal />
      <SetCurrencyModal />
      <SetLayoutModal />
      <SetLRCFeeModal />
      <SetThemeModal />
      <SetTTLModal />
      <SetIsDeveloperModal />
    </div>
  )
}
export default Modals
