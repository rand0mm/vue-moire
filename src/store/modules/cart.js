import axios from 'axios';
import { API_BASE_URL } from '@/config';
import colorName from '@/helpers/colorsName';
const state = {
  productList: [], // [{ productId, amount }]
  userAccessKey: null,
  cartProductsData: [],
  isCartLoad: false,
  deliversData: [],

  loadError: null,
}

const getters = {
  cartProducts: (state) => {
    return state.productList.map((item) => {
      const { product, size, color, id } = state.cartProductsData.find((i) => i.id === item.productId);
      let img = null;

      try {
        img = product.colors[0].gallery[0].file.url
      } catch (error) {
        img = null;
      }
      return {
        amount: item.amount,
        product: {
          id: id,
          title: product.title,
          price: product.price,
          img: img,
          colors: product.colors,
          sku: [{title: 'Цвет', value: colorName(color.color.id)},
          {title: 'Размер', value: size.title}],
        },
      };
    });
  },

  cartTotalPrice: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return total + product.product.price * product.amount
    }, 0)
  },
  deliversData: (state) => {
    return state.deliversData;
  },
  isCartProductsLoad: (state) => {
    return state.isCartLoad;
  },
}

const actions = {
  async loadCart({commit, state}) {
    commit('updateIsCartLoad', true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/baskets`, {params: { userAccessKey: state.userAccessKey, }})
      if (!state.userAccessKey) {
        localStorage.setItem('userAccessKey', res.data.user.accessKey);
        commit('updateUserAccessKey', res.data.user.accessKey);
      }
      commit('updateCartProductsData', res.data.items);
    }  catch (e) {
      commit('setLoadError', e.response.data.error);
      commit('updateCartProductsData', []);
    }
    finally {
      commit('syncProductList');
      commit('updateIsCartLoad', false);
    }
  },
  async addProductToCart({commit}, { productId, colorId, sizeId, amount }) {
    try {
      commit('updateIsCartLoad', true);
      const res = await axios.post(`${API_BASE_URL}/api/baskets/products`,
      { productId, colorId, sizeId, quantity: amount },
      { params : { userAccessKey: state.userAccessKey, }})
      commit('updateCartProductsData', res.data.items);
      return  true
    } catch (e) {
      commit('setLoadError', e.response.data.error);
      return false;
    }
    finally {
      commit('updateIsCartLoad', false);
    }
  },
  async updateProductAmount({commit, state}, { productId, amount }) {
    if (amount < 1) {
      return;
    }
    try {
      commit('updateCartProductAmount', { productId, amount });
      const res = await axios.put(`${API_BASE_URL}/api/baskets/products`,
      { basketItemId: productId, quantity: amount },
      { params:  { userAccessKey: state.userAccessKey, }})
      commit('updateCartProductsData', res.data.items);
    } catch (e) {
      commit('setLoadError', e.response.data.error);
      commit('syncProductList');
    }
  },
  async removeProduct({commit}, productId) {
    try {
      commit('removeProduct', productId);
      const res = await axios.delete(`${API_BASE_URL}/api/baskets/products`,
      { data: { basketItemId: productId }, params: { userAccessKey: state.userAccessKey, } })
      commit('updateCartProductsData', res.data.items);
    } catch (e) {
      commit('setLoadError', e.response.data.error);
      commit('syncProductList');
    }
  },
  async getDelivers({commit}) {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/deliveries`);
      commit('updateDeliversData', res.data)
    } catch (e) {
      commit('setLoadError', e.response.data.error);
      commit('updateDeliversData', [])
    }
  }
}

const mutations = {
  updateIsCartLoad(state, value) {
    state.cartProductListLoad = value;
  },
  updateUserAccessKey(state, accessKey) {
    state.userAccessKey = accessKey;
  },
  updateCartProductsData(state, items) {
    state.cartProductsData = items;
  },
  syncProductList(state) {
    state.productList = state.cartProductsData.map((i) => ({
      productId: i.id,
      amount: i.quantity,
    }));
  },
  resetCart(state) {
    state.productList = [];
    state.cartProductsData = [];
  },
  removeProduct(state, productId) {
    state.productList = state.productList.filter((item) => item.productId !== productId);
  },
  updateCartProductAmount(state, { productId, amount }) {
    const item = state.productList.find((i) => {
      return i.productId == productId
    });
    if (item) {
      item.amount = amount;
    }
  },
  updateDeliversData(state, delivers) {
    state.deliversData = delivers;
  },
  setLoadError(state, error) {
    state.loadError = error;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
