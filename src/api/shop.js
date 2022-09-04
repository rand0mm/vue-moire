import axios from 'axios';
import { API_BASE_URL } from '@/config';


export default {
  getProducts (params) {  // {categoryId, materialIds[], seasonIds[], colorIds[], page, limit, minPrice, maxPrice}
    return axios.get(`${API_BASE_URL}/api/products`,params)
  },
  getProduct(productId) {
    return  axios.get(`${API_BASE_URL}/api/products/${productId}`)
  },

  getOrderInfo(orderId, params) { // { userAccessKey }
    return axios.get(`${API_BASE_URL}/api/orders/${orderId}`, { params })
  },

  getCart(params) {  // { userAccessKey }
    return axios.get(`${API_BASE_URL}/api/baskets`, {params})
  },
  getMaterials() {
    return axios.get(`${API_BASE_URL}/api/materials`)
  },
  getProductCategories() {
    return axios.get(`${API_BASE_URL}/api/productCategories`)
  },
  getSeasons() {
    return axios.get(`${API_BASE_URL}/api/seasons`)
  },
  getColors() {
    return axios.get(`${API_BASE_URL}/api/colors`)
  },
  addToCart(product, params) { // { productId, colorId, sizeId, quantity }
    return axios.post(`${API_BASE_URL}/api/baskets/products`, product, { params })
  },
  changeAmountCart(product, params) { // { productId, quantity}, { userAccessKey }
    return axios.put(`${API_BASE_URL}/api/baskets/products`, product, { params })
  },
  deleteFromCart(params) { // {{ data: { basketItemId } }, params: { userAccessKey }}
    return axios.delete(`${API_BASE_URL}/api/baskets/products`, { params})
  },

}
