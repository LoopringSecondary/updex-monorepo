import config from 'common/config'
import * as orderFormatter from './formatters'
import * as apis from './apis'

const MODULES = 'placeOrder'
export default {
  namespace: MODULES,
  state: {
   side:'buy',
   pair:'LRC-WETH',
   priceInput: '0',
   priceChanged:false,
   amountInput:'0',
   buySliderValue:0,
   sellSliderValue:0,
   showAdvance:false,
   sliderMilliLrcFee:0,
   timeToLivePatternSelect: 'easy',
   timeToLivePopularSetting: true,
   timeToLive: 0,
   timeToLiveUnit: '',
   timeToLiveStart: null,
   timeToLiveEnd: null,
   submitButtonLoading: false,
   rawOrder: null,
   unsigned:null,
   signed:null,
   confirmButtonState : 1, //1:init, 2:loading, 3:submitted
  },
  effects:{
    *init({ payload={} }, { put }) {
      yield put({ type: 'pairChangeEffects',payload});
    },
    *pairChangeEffects({ payload={} }, { put }) {
      let {pair, side, price} = payload
      if(pair) {
        yield put({ type: 'pairChange',payload:{pair}});
        yield put({ type: 'unsignedChange',payload:{unsigned:null}});
        yield put({ type: 'signedChange',payload:{signed:null}});
        if(side) {
          yield put({ type: 'sideChangeEffects',payload:{side}});
        }
        if(price) {
          yield put({ type: 'priceChange',payload:{priceInput:price}});
          yield put({ type: 'priceChangedChange',payload:{priceChanged:true}});
        } else {
          yield put({ type: 'priceChange',payload:{priceInput:0}});
          yield put({ type: 'priceChangedChange',payload:{priceChanged:false}});
        }
      }
    },
    *sideChangeEffects({ payload={} }, { put }) {
      let {side} = payload
      if(side) {
        yield put({ type: 'sideChange',payload:{side}});
        yield put({ type: 'amountChange',payload:{amountInput:0}});
        yield put({ type: 'buySliderValueChange',payload:{value:0}});
        yield put({ type: 'sellSliderValueChange',payload:{value:0}});
      }
    },
    *priceChangeEffects({ payload={} }, { put }) {
      const {price} = payload
      yield put({ type: 'priceChange',payload:{priceInput:price}});
      yield put({ type: 'priceChangedChange',payload:{priceChanged:true}});
      yield put({ type: 'buySliderValueChange',payload:{value:0}});
      yield put({ type: 'sellSliderValueChange',payload:{value:0}});
    },
    *timeToLivePatternChangeEffects({ payload={} }, { select, put }) {
      const {timeToLivePatternSelect} = payload
      if(timeToLivePatternSelect === 'advance') { //[easy, advance]
        let {timeToLiveStart, timeToLiveEnd} = payload
        if(timeToLiveStart && timeToLiveEnd) {
          yield put({ type: 'timeToLivePatternChange',payload:{timeToLivePatternSelect}});
          yield put({ type: 'timeToLiveStartEndChange',payload:{timeToLiveStart, timeToLiveEnd}});
        }
      } else {
        yield put({ type: 'timeToLivePatternChange',payload:{timeToLivePatternSelect}});
      }
    },
    *timeToLiveEasyTypeChangeEffects({ payload={} }, { select, put }) {
      const {type, timeToLive, timeToLiveUnit} = payload
      if(type === 'popular') {
        yield put({ type: 'timeToLiveEasyPopularSettingChange',payload:{timeToLivePopularSetting:payload.timeToLivePopularSetting}});
        yield put({ type: 'timeToLiveEasyPopularValueChange',payload:{timeToLive, timeToLiveUnit}});
      } else {
        yield put({ type: 'timeToLiveEasyPopularValueChange',payload:{timeToLive, timeToLiveUnit}});
      }
    },
    *toConfirm({ payload={} }, { select, put }) {
      const {unsigned, signed} = payload
      yield put({ type: 'unsignedChange',payload:{unsigned}});
      yield put({ type: 'signedChange',payload:{signed}});
      yield put({ type: 'confirmButtonStateChange',payload:{buttonState:1}});
    },
    *sendDone({ payload={} }, { put }) {
      const {signed} = payload
      yield put({ type: 'signedChange',payload:{signed}});
      yield put({ type: 'confirmButtonStateChange',payload:{buttonState:3}});
    },
    *unlock({ payload={} }, { select, put ,call}) {
      const {signed,unsigned} = yield select(({ [MODULES]:state }) => state )
      if(!unsigned || unsigned.length === 0) {
        return
      }
      let actualSigned = signed ? signed.filter(item => item !== undefined) : []
      if(unsigned.length === actualSigned.length) {
        return
      }
      const {account, unlockType, address} = yield select(({ ['wallet']:state }) => state )
      if(!account || unlockType === 'address') {
        return
      }
      const signedNew = yield call(apis.signAll, {signed,unsigned,account,address})
      yield put({ type: 'signedChange',payload:{signed:signedNew}});
      yield put({ type: 'confirmButtonStateChange',payload:{buttonState:1}});
    }
  },
  reducers: {
    sideChange(state, action) {
      let {payload} = action
      let {side} = payload
      return {
        ...state,
        side
      }
    },
    showAdvanceChange(state, action) {
      let {payload} = action
      let {showAdvance} = payload
      return {
        ...state,
        showAdvance
      }
    },
    priceChange(state, action) {
      const {priceInput} = action.payload
      let price = 0
      if(state.pair) {
        const l = state.pair.split('-')[0].toUpperCase()
        const r = state.pair.split('-')[1].toUpperCase()
        const marketConfig = config.getMarketBySymbol(l, r)
        if(marketConfig) {
          price = orderFormatter.formatPriceByMarket(priceInput, marketConfig)
        }
      }
      return {
        ...state,
        priceInput : price
      }
    },
    priceChangedChange(state, action) {
      let {payload} = action
      let {priceChanged} = payload
      return {
        ...state,
        priceChanged
      }
    },
    amountChange(state, action) {
      let amount = 0
      if(!action.payload) {
        amount = orderFormatter.sliderChangeEffectAmount(state)
      } else{
        if(state.pair) {
          const l = state.pair.split('-')[0].toUpperCase()
          const r = state.pair.split('-')[1].toUpperCase()
          const tokenRConfig = config.getTokenBySymbol(r)
          const marketConfig = config.getMarketBySymbol(l, r)
          if(tokenRConfig && marketConfig) {
            amount = orderFormatter.formatAmountByMarket(action.payload.amountInput, tokenRConfig, marketConfig)
          }
        }
      }
      return {
        ...state,
        amountInput : amount
      }
    },
    pairChange(state, action) {
      const {pair} = action.payload
      return {
        ...state,
        pair
      }
    },
    buySliderValueChange(state, action) {
      const {value} = action.payload
      return {
        ...state,
        buySliderValue: value
      }
    },
    sellSliderValueChange(state, action) {
      const {value} = action.payload
      return {
        ...state,
        sellSliderValue: value
      }
    },
    milliLrcFeeChange(state, action) {
      const {payload} = action
      let {milliLrcFee} = payload
      return {
        ...state,
        sliderMilliLrcFee:milliLrcFee
      }
    },
    timeToLivePatternChange(state, action) {
      const {payload} = action
      let {timeToLivePatternSelect} = payload
      return {
        ...state,
        timeToLivePatternSelect
      }
    },
    timeToLiveStartEndChange(state, action) {
      const {payload} = action
      let {timeToLiveStart, timeToLiveEnd} = payload
      return {
        ...state,
        timeToLiveStart,
        timeToLiveEnd
      }
    },
    timeToLiveEasyPopularSettingChange(state, action) {
      const {payload} = action
      let {timeToLivePopularSetting} = payload
      return {
        ...state,
        timeToLivePopularSetting
      }
    },
    timeToLiveEasyPopularValueChange(state, action) {
      const {payload} = action
      let {timeToLive, timeToLiveUnit} = payload
      return {
        ...state,
        timeToLive,
        timeToLiveUnit
      }
    },
    submitButtonLoadingChange(state, action) {
      const {payload} = action
      let {submitButtonLoading} = payload
      return {
        ...state,
        submitButtonLoading
      }
    },
    unsignedChange(state, action) {
      const {payload} = action
      let {unsigned} = payload
      return {
        ...state,
        unsigned
      }
    },
    signedChange(state, action) {
      const {payload} = action
      let {signed} = payload
      return {
        ...state,
        signed
      }
    },
    confirmButtonStateChange(state, action) {
      const {payload} = action
      let {buttonState} = payload
      return {
        ...state,
        confirmButtonState:buttonState
      }
    },
    rawOrderChange(state, action) {
      const {payload} = action
      let {rawOrder} = payload
      return {
        ...state,
        rawOrder
      }
    },
  },
};


