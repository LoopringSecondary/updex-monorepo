import React from 'react'
import {Drawer} from 'antd'
import './Drawer.less'

const DrawerWrapper = (props)=>{
  const {
    children,id,
    width='auto',
    height='100vh',
    position='left',
    showMask=true,
    level='all', // all, null, className, id, tagName, array
    mask,closable=false,maskClosable=false,apisOnly=false,wrapClassName="",className="",
    zIndex=1000,
    style,
    ...rest
  } = props
  const {[id]:module={}} = props
  const drawerProps = {
    className,
    // wrapClassName,
    width,
    height,
    placement:position,
    // maskClosable:showMask,
    maskClosable,
    closable,
    // level,
    visible:module.visible,
    onClose:module.hideLayer && module.hideLayer.bind(this),
    destroyOnClose:true,
    zIndex,
  }
  const childProps = {...rest}
  return (
    <Drawer {...drawerProps}>
      <div style={{...style}}>
        {
          React.Children.map(children, child => {
              return React.cloneElement(child, {...childProps})
          })
        }
      </div>
    </Drawer>
  )
}
export default DrawerWrapper
