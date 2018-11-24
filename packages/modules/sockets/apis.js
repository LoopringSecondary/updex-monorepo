import io from 'socket.io-client'
import config from 'common/config'
import storage from '../storage/'
import {toBig, toFixed} from 'LoopringJS/common/formatter'
import intl from "react-intl-universal";
import Notification from 'LoopringUI/components/Notification'
import {LooprAccount, UpWalletAccount, ImTokenAccount} from "common/wallets/account";

const updateItems = (items,id)=>{
  const dispatch = window._store.dispatch
  dispatch({
    type:'sockets/itemsChange',
    payload:{id,items,loading:false}
  })
}
const updateItem = (item,id)=>{
  const dispatch = window._store.dispatch
  dispatch({
    type:'sockets/itemChange',
    payload:{id,item,loading:false}
  })
}

const isArray = (obj)=>{
  return Object.prototype.toString.call(obj) === '[object Array]'
}

const sorter = (a, b)=>{
  return a.start - b.start;
}

const updateEstimateGasPrice = (item,id)=>{
  const dispatch = window._store.dispatch
  if(item.value) {
    const gasPrice = toFixed(toBig(item.value).div(1e9))
    dispatch({
      type:'gas/estimateGasChange',
      payload:{gasPrice}
    })
  }
}

const updateScannedAddress = (item, id) => {
  if (item && item.owner) {
    const dispatch = window._store.dispatch
    dispatch({type: 'scanAddress/addressChanged', payload: {address: item.owner}})
    const loopringUnlockWith = storage.wallet.getLoopringUnlockWith()
    switch(loopringUnlockWith) {
      case 'loopr':
        window.WALLET = new LooprAccount(item.owner);
        dispatch({type: "wallet/unlockLooprWallet", payload: {address: item.owner}});
        break;
      case 'upWallet':
        window.WALLET = new UpWalletAccount(item.owner);
        dispatch({type: "wallet/unlockUpWallet", payload: {address: item.owner}});
        break;
      case 'imToken':
        window.WALLET = new ImTokenAccount(item.owner);
        dispatch({type: "wallet/unlockImToken", payload: {address: item.owner}});
        break;
    }
    window.RELAY.account.register(item.owner)
    Notification.open({type:'success',description:intl.get('notifications.title.unlock_suc')});
    dispatch({type: 'sockets/unlocked'});
    dispatch({type:"layers/hideLayer", payload:{id:'authOfPC'}})
    dispatch({type:"layers/hideLayer", payload:{id:'unlockByLoopr'}})
    dispatch({type: 'scanAddress/reset', payload: {}})
  }
}

const updateNotified = (item, id) => {
  if(item && item.status === 'accept') {
    const dispatch = window._store.dispatch
    dispatch({type: 'p2pOrder/setFetchOrder', payload: {fetchOrder:true}})
  }
}

const transfromers = {
  transaction:{
    queryTransformer:(payload)=>{
      const {filters,page} = payload
      return JSON.stringify({
        owner:storage.wallet.getUnlockedAddress(),
        symbol:filters.token,
        status:filters.status,
        txType:filters.type,
        pageIndex:page.current,
        pageSize:page.size || 10,
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      // console.log(id,'res',res)
      let items = []
      if (!res.error && res.data && isArray(res.data.data)) {
        items =[ ...res.data.data ]
      }
      updateItems(items,id)
    },
  },
  balance:{
    queryTransformer:(payload)=>{
      return JSON.stringify({
         delegateAddress: config.getDelegateAddress(),
         owner:storage.wallet.getUnlockedAddress()
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
     // console.log(id,'res',res)
      let items = []
      if (!res.error && res.data && isArray(res.data.tokens)) {
        items =[ ...res.data.tokens ]
      }
      updateItems(items,id)
    },
  },
  orders:{
    queryTransformer:(payload)=>{
      const {filters} = payload;
      return JSON.stringify({
         delegateAddress: config.getDelegateAddress(),
         owner:storage.wallet.getUnlockedAddress(),
         market:filters.market,
         orderType: filters.type || 'market_order'
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
     // console.log(id,'res',res)
      let items = []
      if (!res.error && res.data && isArray(res.data)) {
        items =[ ...res.data ]
      }
      updateItems(items,id)
    },
  },
  marketcap:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
        "currency": filters.currency || storage.settings.get().preference.currency,
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
    //  console.log(id,'res',res)
      let items =[]
      if (!res.error && res.data && isArray(res.data.tokens)) {
        items =[ ...res.data.tokens ]
      }
      updateItems(items,id)
    },
  },
  depth:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market,// TODO
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
   // console.log(id,'res',res)
      let item ={}
      if(!res.error && res.data && res.data.depth){
        item ={ ...res.data.depth }
      }
      updateItem(item,id)
    },
  },
  trends: {
    queryTransformer: (payload) => {
      const {filters} = payload
      return JSON.stringify({
        "delegateAddress": config.getDelegateAddress(),
        "market": filters.market,
        "interval": '1Hr',
      })
    },
    resTransformer: (id, res) => {
      if (!res) return null
      res = JSON.parse(res)
      // console.log(id,'res',res)
      let items = []
      if (!res.error && res.data && isArray(res.data)) {
        items = [...res.data]
      }
      updateItems(items, id)
      if(window.TrendCallBack) {
        console.log('trends socket callback...')
        const sorted = items.sort(sorter)
        const last = sorted[sorted.length - 1]
        const data = {
          close:last.close,
          high:last.high,
          //isBarClosed: true,
          //isLastBar: false,
          low:last.low,
          open:last.open,
          time:last.start * 1000,
          volume:last.vol
        }
        window.TrendCallBack(data)
      }
    },
  },
  trades:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market, //TODO
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      //console.log(id,'res',res)
      let items =[]
      if(!res.error && isArray(res.data)){
        items =[ ...res.data ]
      }
      updateItems(items,id)
    },
  },
  tickers:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market, //TODO
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      //console.log(id,'res',res)
      res = JSON.parse(res)
      //console.log(id,'res',res)
      let item = {}
      if(!res.error && res.data){
        item ={...res.data}
      }
      updateItem(item,id)
    },
  },
  loopringTickers:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
         "delegateAddress" :config.getDelegateAddress(),
         "market":filters.market, //TODO
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      //console.log(id,'res',res)
      let items =[]
      if(!res.error && isArray(res.data)){
        const supportMarket = res.data.filter(item=>config.isSupportedMarket(item.market)) // filter support market
        items =[ ...supportMarket ]
      }
      updateItems(items,id)
    },
  },
  tickersOfSource:{
    queryTransformer:(payload)=>{
      const {filters} = payload
      return JSON.stringify({
        ...filters
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      //console.log(id,'res',res)
      let items =[]
      if(!res.error && isArray(res.data)){
        items = res.data
      }
      updateItems(items,id)
      const marketR = {}
      const markets = items.map(item=>{
        const m = item.market.split("-")
        marketR[m[1]] = true
        return {
          "tokenx": m[0],
          "tokeny": m[1],
          "market": item.market,
          "pricePrecision": item.decimals || 8
        }
      })
      storage.settings.setMarketPairs(markets)
      storage.settings.setMarketR(Object.keys(marketR))
    },
  },
  pendingTx:{
    queryTransformer:(payload)=>{
      return JSON.stringify({
         owner:storage.wallet.getUnlockedAddress()
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      //console.log(id,'res',res)
      let items =[]
      if(!res.error && isArray(res.data)){
        items =[ ...res.data ]
      }
      updateItems(items,id)
    },
  },
  estimatedGasPrice:{
    queryTransformer:(payload)=>{
      return ""
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      //  console.log(id,'res',res)
      let item = {}
      if (!res.error && res.data ) {
        item.value = res.data
      }
      updateEstimateGasPrice(item,id)
    },
  },
  orderAllocateChange:{
    queryTransformer:(payload)=>{
      return JSON.stringify({
        owner:storage.wallet.getUnlockedAddress(),
        delegateAddress:config.getDelegateAddress()
      })
    },
    resTransformer:(id,res)=>{
      if(!res) return null
      res = JSON.parse(res)
      let items = {}
      if (!res.error && res.data && res.data.allocatedResult) {
        items = {...res.data.allocatedResult,frozenLrcFee:res.data.FrozenLrcFee}
      }
      updateItems(items,id)
    },
  },
  addressUnlock: {
    queryTransformer: (payload) => {
      const {extra} = payload
      return JSON.stringify({
        "uuid": extra.UUID,
      })
    },
    resTransformer: (id, res) => {
      if (!res) return null
      res = JSON.parse(res)
      // console.log(id,'res',res)
      let item = {}
      if (!res.error && res.data) {
        item = {...res.data}
      }
      // updateItem(item,id)
      updateScannedAddress(item, id)
    },
  },
  circulrNotify: {
    queryTransformer: (payload) => {
      const {extra} = payload;
      return JSON.stringify({
        owner: storage.wallet.getUnlockedAddress()||extra.hash,
      })
    },
    resTransformer: (id, res) => {
      if (!res) return null
      res = JSON.parse(res)
      let item = {}
      if (!res.error && res.data && res.data.body) {
        item = {...res.data.body}
      }
      updateItem(item, id)
      updateNotified(item, id)
    },
  },
}
const getQueryTransformer = (id)=>{
  if(transfromers[id] && transfromers[id].queryTransformer){
    return transfromers[id].queryTransformer
  }else{
    return ()=>{console.log(id,'no queryTransformer')}
  }
}
const getResTransformer = (id)=>{
  if(transfromers[id] && transfromers[id].resTransformer){
    return transfromers[id].resTransformer
  }else{
    return ()=>{console.log(id,'no resTransformer')}
  }
}

const emitEvent = (payload)=>{
  let {id,socket} = payload
  const transfromer = getQueryTransformer(id)
  console.log(id)
  socket.emit(`${id}_req`,transfromer(payload))
}

const onEvent = (payload)=>{
  let {id,socket} = payload
  const transfromer = getResTransformer(id)
  socket.on(`${id}_res`,transfromer.bind(this,id))
}

const hasListener = (payload) => {
  const {id, socket} = payload;
  return socket.hasListeners(`${id}_res`)
}

const connect = (payload)=>{
  const {url}= payload
  let options = {
    transports: ['websocket']
  }
  const socket = io(url,options)
  socket.on('disconnect', (data) => {
    console.log('socket disconnect')
  })
  socket.on('error', (err) => {
    console.log('socket error',err)
  })
  return new Promise((resolve,reject)=>{
    socket.on('connect',()=>{
      console.log('socket connect success!')
      resolve(socket)
    })
  })
}
export default {
  onEvent,
  emitEvent,
  connect,
  hasListener
}




