import {setLocale} from "../../common/utils/localeSetting";
import STORAGE from '../storage';

const language = STORAGE.settings.get().preference.language;

export default {
  namespace: 'locales',
  state: {
    locale: language || 'en-US',
  },
  reducers: {
    localeChange(state, { payload }) {
      return {
        locale: payload.locale,
      };
    },
  },

  effects: {
    * setLocale({payload}, {put, call}) {
      yield put({type: "localeChange", payload: {locale: payload.locale}});
      yield call(setLocale, payload.locale);
      if (payload.storage) {
        const settings = STORAGE.settings.get();
        settings.preference.language = payload.locale || settings.preference.language
        STORAGE.settings.set(settings);
      }
    }
  }
};
