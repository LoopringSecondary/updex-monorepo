import React from 'react'
import routeActions from 'common/utils/routeActions'
import {Button, NavBar} from 'antd-mobile'
import {Icon} from 'antd'

class Home extends React.Component {

  render(){
    const {onScan} = this.props;
    return (
      <div className="" style={{ }}>
         <div className="pt25 zb-b-b text-center bg-white">
           <img className="circle-50" src={require('assets/images/loopr.png')} alt=""/>
           <div className="fs20 color-black-1 mt15">路印扫码交易</div>
           <div className="fs12 color-black-2 mt5">随时随地地在所有路印DEX上安全交易</div>
           <div className="row no-gutters bg-white align-items-center mt10" onClick={onScan}>
             <div className="col">
               <div className="text-center pl5 pr5 pt15 pb15 zb-b-b">
                <div className="circle-35 center-center m-auto bg-primary-light text-primary fs16"><Icon type="user" /></div>
                <div className="fs13 color-black-2 mt10">扫码登录</div>
                <div hidden className="fs11 color-black-3 ">签名</div>
               </div>
             </div>
             <div className="col">
               <div className="text-center pl5 pr5 pt15 pb15 zb-b-b">
                <div className="circle-35 center-center m-auto bg-primary-light text-primary fs16"><Icon type="safety" /></div>
                <div className="fs13 color-black-2 mt10">扫码签名</div>
                <div hidden className="fs11 color-black-3 ">P2P</div>
               </div>
             </div>
             <div className="col">
               <div className="text-center pl5 pr5 pt15 pb15 zb-b-b">
                <div className="circle-35 center-center m-auto bg-primary-light text-primary fs16"><Icon type="audit" /></div>
                <div className="fs13 color-black-2 mt10">扫码下单</div>
                <div hidden className="fs11 color-black-3 ">签名</div>
               </div>
             </div>
             <div className="col">
               <div className="text-center pl5 pr5 pt15 pb15 zb-b-b">
                <div className="circle-35 center-center m-auto bg-primary-light text-primary fs16"><Icon type="deployment-unit" /></div>
                <div className="fs13 color-black-2 mt10">扫码吃单</div>
                <div hidden className="fs11 color-black-3 ">P2P</div>
               </div>
             </div>
             <div className="col">
               <div className="text-center pl5 pr5 pt15 pb15 zb-b-b">
                <div className="circle-35 center-center m-auto bg-primary-light text-primary fs16"><Icon type="experiment" /></div>
                <div className="fs13 color-black-2 mt10">更多</div>
                <div hidden className="fs11 color-black-3 ">P2P</div>
               </div>
             </div>
           </div>
           <div className="p15">
            <Button type="primary" className="" onClick={onScan}><Icon type="scan" className="mr5" />扫码</Button>
            <Button onClick={routeActions.gotoPath.bind(this,'/dex/home')} type="default" className="bg-primary-light text-primary border-none mt15"><Icon type="home" className="mr5" />首页</Button>
           </div>
         </div>
         <div className="p15">
           <div className="color-black-3 fs12 lh20">
            1. 可以对任何支持路印协议的去中心化交易所进行扫码交易。目前支持 UP DEX,Circulr DEX等
           </div>
         </div>
      </div>
    )
  }
}

export default Home
