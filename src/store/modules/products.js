
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { API_BASE_URL } from '@/config';


const state = {
  productsData: null,
  materialsData: null,
  productCategoriesData: null,
  seasonsData: null,
  colorsData: null,

  loadError: null
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
        color: {id: product.colors[0].id, colorId:product.colors[0].color.id},
        pricePretty: numberFormat( product.price )
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
    try { // {categoryId, materialIds[], seasonIds[], colorIds[], page, limit, minPrice, maxPrice}
      const res = await axios.get(`${API_BASE_URL}/api/products`,params)
      commit('setProducts', res.data);
    } catch (e) {
      commit('setLoadError', e.response.data.error)
    }
  },
  async getMaterials({commit}) {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/materials`);
      commit('setMaterials', res.data);
    } catch (e) {
      commit('setLoadError', e.response.data.error)
    }
  },
  async getProductCategories({commit}) {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/productCategories`);
      commit('setProductCategories', res.data);
    } catch (e) {
      commit('setLoadError', e.response.data.error)
    }
  },
  async getSeasons({commit}) {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/seasons`)
      commit('setSeasons', res.data);
    } catch (e) {
      commit('setLoadError', e.response.data.error)
    }
  },
  async getColors({commit}) {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/colors`)
      commit('setColors', res.data);
    } catch (e) {
      commit('setLoadError', e.response.data.error)
    }
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
  setLoadError (state, error) {
    state.loadError = error
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
