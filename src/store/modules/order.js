import axios from 'axios';
import { API_BASE_URL } from '@/config';

const state = {
  orderInfo: null,
}

const getters = {
  orderInfo: (state) => {
    return state.orderInfo;
  },
}

const actions = {
  async loadOrderInfo({commit,rootState}, orderId) {
     try {
      const res = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`,
       {params: { userAccessKey: rootState.cart.userAccessKey, }})
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
