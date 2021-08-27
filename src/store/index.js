import * as _ from "fxjs";
import * as $ from "fxdom";
import { createStore } from 'vuex'

export const store = createStore({
  state: {
    stickers: [],
    userInfo: {
      userId: 0,
      userImage: null,
      stickers: [
        {
          id: '0-0',
          width: null, 
          height: null, 
          left: null, 
          top: null, 
          scaleX: null, 
          scaleY: null, 
          angle: null,
        },
      ]
    },
  },
  mutations: {
    init(state, payload) {
      state.stickers = payload.stickers;
    },
    setStickersInfo(state, payload) {
      state.userInfo.stickers = payload.stickersInfo;
      state.userInfo.userImage = payload.userImage;
      console.log("state.userInfo------------", state.userInfo);
    },
  },
  actions: {
    async init({ commit }, payload) {
      const stickers = await import('../test/stickers.js');
      // console.log("stickers ------store", stickers.default);
      commit('init', {'stickers': stickers.default.stickers});
    },
    // getSelectedItem({ commit, rootState }, payload) {
    //   commit('getSelectedItem', {'dataName': payload.dataName, 'currId': payload.currId, 'contents': payload.contents, 'selectedItemIndex': payload.selectedItemIndex, 'lang': rootState.isLangKr ? 'KR' : 'ENG' });
    // },
  }
})
