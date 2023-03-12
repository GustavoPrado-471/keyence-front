import { createStore } from "vuex";

export default createStore({
  state: {
    userAuth: false,
    itemsTable: [],
    testChangeState: true
  },
  getters: {
    actualState(state) {
      return state.userAuth;
    },
  },
  mutations: {
    setUserAuth(state, payload) {
      state.userAuth = payload;
    },
    setTestChangeState(state, payload){
      state.testChangeState = payload;
    }
  },
  actions: {
    currentUser(state) {
      return state.userAuth;
    },
  },
  modules: {},
});
