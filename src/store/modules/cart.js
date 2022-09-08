import shop from '../../api/shop'

const state = {
  productList: [], // [{ productId, amount }]
  userAccessKey: null,
  cartProductsData: [],
  isCartLoad: false,
  deliversData: [],
}

const getters = {
  cartProducts: (state) => {
    return state.productList.map((item) => {
      const { product } = state.cartProductsData.find((i) => i.product.id === item.productId);
      let img = null;
      try {
        img = product.colors[0].gallery[0].file.url
      } catch (error) {
        img = null;
      }
      return {
        amount: item.amount,
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          img: img,
          colorList: product.colors,
          color: product.colors[0].id,
        },
      };
    });
  },

  cartTotalPrice: (getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return total + product.price * product.amount
    }, 0)
  },
  deliversData: (state) => {
    return state.deliversData
  },
  isCartProductsLoad: (state) => {
    return state.isCartLoad;
  },
}

const actions = {
  async loadCart({commit, state}) {
    commit('updateIsCartLoad', true);
    try {
      const res = await shop.getCart({ userAccessKey: state.userAccessKey, });

      if (!state.userAccessKey) {
        localStorage.setItem('userAccessKey', res.data.user.accessKey);
        commit('updateUserAccessKey', res.data.user.accessKey);
      }
      commit('updateCartProductsData', res.data.items);
    }  catch (error) {
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
      const res = await shop.addToCart({ productId, colorId, sizeId, quantity: amount },{ userAccessKey: state.userAccessKey, });
      commit('updateCartProductsData', res.data.items);
      return  true
    } catch (error) {
      return false;
    }
    finally {
      commit('updateIsCartLoad', false);
    }
  },
  async updateProductAmount({commit}, { productId, amount }) {
    if (amount < 1) {
      return;
    }
    try {
      commit('updateCartProductAmount', { productId, amount });
      const res = await shop.changeAmountCart({ productId, amount }, { userAccessKey: state.userAccessKey, })

      commit('updateCartProductsData', res.data.items);
    } catch (error) {
      commit('syncProductList');
    }
  },
  async removeProduct({commit}, productId) {
    try {
      commit('removeProduct', productId);
      const res = await shop.deleteFromCart({ data: { basketItemId: productId }, params: { userAccessKey: state.userAccessKey, } })

      commit('updateCartProductsData', res.data.items);
    } catch (error) {
      commit('syncProductList');
    }
  },
  async getDelivers({commit}) {
    try {
      const res = await shop.getDelivers();
      commit('updateDeliversData', res.data)
    } catch (error) {
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
      productId: i.product.id,
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
    const item = state.productList.find((i) => i.productId === productId);
    if (item) {
      item.amount = amount;
    }
  },
  updateDeliversData(state, delivers) {
    state.deliversData = delivers;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
