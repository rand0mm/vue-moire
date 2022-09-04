import { createStore } from 'vuex';
import productModule from '@/store/modules/products'
import cartModule from '@/store/modules/cart'
import orderModule from '@/store/modules/order'


export default createStore({
  modules: {
    products: productModule,
    cart: cartModule,
    order: orderModule
  }
})
