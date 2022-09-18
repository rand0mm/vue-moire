<template>
  <router-link class="header__cart" href="cart.html"
   aria-label="Корзина с товарами" :to="{name: 'cart'}">
    <svg width="30" height="21" fill="currentColor">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <span class="header__count" v-if="isCartLoad"> Загрузка...</span>
    <span class="header__count" v-else aria-label="Количество товаров" >
       {{productsAmount}}</span>
  </router-link>
</template>

<script>
import { useStore } from 'vuex';
import { defineComponent, computed} from 'vue';

export default defineComponent({
  setup() {
    const store = useStore();
    const isCartLoad = computed(() => store.getters['cart/isCartProductsLoad'])
    const productsAmount = computed(() => store.getters['cart/cartProductsAmount'])
    return {
      isCartLoad,
      productsAmount,
    }
  }

})



</script>
