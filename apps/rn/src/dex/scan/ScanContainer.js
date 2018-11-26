import React from 'react'
import {connect} from 'dva'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import {Toast} from 'antd-mobile'
import {scanQRCode, signMessage} from 'common/utils/signUtils'
import moment from 'moment'
import Notification from 'LoopringUI/components/Notification'
import ScanQRCode from './ScanQrcode'

class ScanContainer extends React.Component {

  componentDidMount() {
    const {dispatch} = this.props
    const type = routeActions.location.getQueryByName(this.props, 'type')
    if(!type){
      return
    }
    Toast.loading(intl.get('common.list.loading'), 0, null, false);
    try {
      switch (type) {
        case "UUID":
          setTimeout(() => Toast.hide(), 500);
          this.showLayer({id:'login',uuid:routeActions.location.getQueryByName(this.props, 'value')})
          break;
        case "P2P":
          const res = {}
          const result = {}
          const value = {}
          value.hash = routeActions.location.getQueryByName(this.props, 'hash')
          value.auth = routeActions.location.getQueryByName(this.props, 'auth')
          value.count = Number(routeActions.location.getQueryByName(this.props, 'count'))
          result.value = value
          result.type = "P2P"
          res.result = JSON.stringify(result)
          window.handleP2POrder(res);
          break;
        case 'sign':
        case 'cancelOrder':
        case 'convert':
          const v = routeActions.location.getQueryByName(this.props, 'value')
          window.RELAY.account.notifyCircular({
            "owner": window.Wallet.address,
            "body": {hash: v, "status": "received"}
          })
          window.RELAY.order.getTempStore({key: v}).then(resp => {
            if (resp.error) {
              throw  intl.get('scan.result.unsupported_type',{type})
            }
            let unsigned = null
            switch (type) {
              case 'sign': // [{type:'', data:''}]
                unsigned = JSON.parse(resp.result)
                break;
              case 'cancelOrder': // original order
                unsigned = [{type: 'cancelOrder', data: JSON.parse(resp.result)}]
                break;
              case 'convert': // {tx: '', owner: ''}
                unsigned = [{type: 'convert', data: JSON.parse(resp.result).tx}]
                break;
              default:
                throw  intl.get('scan.result.unsupported_type',{type})
            }
            dispatch({type: 'sign/unsigned', payload: {unsigned, qrcode: {type, value: v}}})
            Toast.hide();
            this.showLayer({id: 'signMessages'})
          }).catch(e => {
            Toast.hide();
            window.RELAY.account.notifyCircular({
              "owner": window.Wallet.address,
              "body": {hash: v, "status": "reject"}
            })
          })
          break;
        default:
          setTimeout(() => Toast.hide(), 500);
          dispatch({type: 'layers/showLayer', payload: {id: 'signResult', error: {message:intl.get('scan.result.unrecognized_type')}}})
      }
    } catch (e) {
      dispatch({type: 'layers/showLayer', payload: {id: 'signResult', error: e}})
      setTimeout(() => Toast.hide(), 500);
    }
  }

  showLayer = (payload = {}) => {
    this.props.dispatch({
      type: 'layers/showLayer',
      payload: {
        ...payload
      }
    })
  }

  render() {
    const {dispatch} = this.props;
    const scan = () => {
      scanQRCode().then(res => {
        if (res.result) {
          const type = routeActions.search.getQueryByName(res.result, 'type');
          const v = routeActions.search.getQueryByName(res.result, 'value')
          switch (type) {
            case 'UUID':
              this.showLayer({id:'login',uuid:routeActions.search.getQueryByName(res.result, 'value')})
              // this.authToLogin(routeActions.search.getQueryByName(res.result, 'value'));
              break;
            case 'sign':
            case 'cancelOrder':
            case 'convert':
              window.RELAY.account.notifyCircular({
                "owner": window.Wallet.address,
                "body": {hash:v, "status": "received"}
              })
              window.RELAY.order.getTempStore({key: v}).then(resp => {
                if (resp.error) {
                  throw `Unsupported type:${type}`
                }
                let unsigned = null
                switch (type) {
                  case 'sign': // [{type:'', data:''}]
                    unsigned = JSON.parse(resp.result)
                    break;
                  case 'cancelOrder': // original order
                    unsigned = [{type: 'cancelOrder', data: JSON.parse(resp.result)}]
                    break;
                  case 'convert': // {tx: '', owner: ''}
                    unsigned = [{type: 'convert', data: JSON.parse(resp.result).tx}]
                    break;
                  default:
                    throw `Unsupported type:${type}`
                }
                dispatch({type: 'sign/unsigned', payload: {unsigned, qrcode: {type, value:v}}})
                this.showLayer({id: 'signMessages'})
              }).catch(e => {
                window.RELAY.account.notifyCircular({
                  "owner": window.Wallet.address,
                  "body": {hash: v, "status": "reject"}
                })
              })
              break;
            case 'P2P':
              const content = {}
              const result = {}
              const value = {}
              value.hash = routeActions.search.getQueryByName(res.result, 'hash')
              value.auth = routeActions.search.getQueryByName(res.result, 'auth')
              value.count = Number(routeActions.search.getQueryByName(res.result, 'count'))
              result.value = value
              result.type = "P2P"
              content.result = JSON.stringify(result)
              window.handleP2POrder(content)
              break;
            default:
              throw `Unsupported type:${type}`
          }
        }
      }).catch(e => {
        // Toast.fail(e, 10, null, false)
      })
    }
    return (
      <div className="">
        <ScanQRCode onScan={scan}/>
      </div>
    )
  }
}

export default connect()(ScanContainer)
