
import shop from '@/api/shop'

const state = {
  productsData: null,
  materialsData: null,
  productCategoriesData: null,
  seasonsData: null,
  colorsData: null,
}

const getters = {
  products: (state) => {
    return state.productsData ? state.productsData.items.map((product) => {
      let img = null;
      try {
        img = product.colors[0].gallery[0].file.url
      } catch (error) {
        img = null;
      }
      return {
        id: product.id,
        categoryId: 1,
        title: product.title,
        price: product.price,
        img: img,
        colorList: product.colors,
        color: product.colors[0].id,
      }
    }) : [];
  },
  countProduct: (state) => {
    return state.productsData ? state.productsData.pagination.total : 0;
  },
  materials: (state) => {
    return state.materialsData ? state.materialsData.items : [];
  },
  productCategories: (state) => {
    return state.productCategoriesData ? state.productCategoriesData.items : [];
  },
  seasons: (state) => {
    return state.seasonsData ? state.seasonsData.items : [];
  },
  colors: (state) => {
    return state.colorsData ? state.colorsData.items : [];
  },

}

const actions = {
  async getProducts({commit},params) {
    const res = await shop.getProducts(params);
    commit('setProducts', res.data);
    return res.data
  },
  async getMaterials({commit}) {
    const res = await shop.getMaterials();
    commit('setMaterials', res.data);
    return res.data
  },
  async getProductCategories({commit}) {
    const res = await shop.getProductCategories();
    commit('setProductCategories', res.data);
    return res.data
  },
  async getSeasons({commit}) {
    const res = await shop.getSeasons();
    commit('setSeasons', res.data);
    return res.data
  },
  async getColors({commit}) {
    const res = await shop.getColors();
    commit('setColors', res.data);
    return res.data
  }
}

const mutations = {
  setProducts (state, products) {
    state.productsData = products
  },
  setMaterials (state, materials) {
    state.materialsData = materials
  },
  setProductCategories (state, categories) {
    state.productCategoriesData = categories
  },
  setSeasons (state, seasons) {
    state.seasonsData = seasons
  },
  setColors (state, colors) {
    state.colorsData = colors
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
