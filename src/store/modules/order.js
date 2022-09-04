import shop from '../../api/shop'

const state = {
  orderInfo: null,
}

const getters = {
  orderInfo: (state) => {
    return state.orderInfo;
  },
}

const actions = {
  async loadOrderInfo(commit, {params, orderId}) {
     try {
      const res = await shop.getOrderInfo(params, orderId);
      commit('updateOrderInfo', res.data);
     } catch (error) {
      commit('updateOrderInfo', error);
     }
    }
}

const mutations = {
  updateOrderInfo(state, orderInfo) {
    state.orderInfo = orderInfo;
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
