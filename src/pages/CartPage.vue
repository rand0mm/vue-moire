<template>
    <main class="content container" v-if="productListLoad"> Загрузка товаров </main>
    <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link
            class="breadcrumbs__link"
            :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
        {{prettyProductAmount}}
      </span>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItemVue v-for="item in productList" :key="item.productId" :item="item"/>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ cartTotalPricePretty }} ₽</span>
          </p>

          <router-link
            v-slot="{navigate}"
            custom
            :to="{ name: 'order'}">
            <button
              class="cart__button button button--primery"
              v-if="productListNotEmpty"
              @click="navigate"
              type="button">
              Оформить заказ
            </button>
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import CartItemVue from '@/components/cart/CartItem.vue';
import numberFormat from '@/helpers/numberFormat';
import productAmount from '@/helpers/productAmount';

import { defineComponent, computed} from 'vue';
import { useStore } from 'vuex'


export default defineComponent({
  components: { CartItemVue },
  setup() {
    const store = useStore();

    const productList = computed(() => store.getters['cart/cartProducts'])
    const cartTotalPrice = computed(() => store.getters['cart/cartTotalPrice'])
    const productListLoad = computed(() => store.getters['cart/isProductListLoad'])
    const cartTotalPricePretty = computed(() => numberFormat(cartTotalPrice.value))
    const prettyProductAmount = computed(() => productAmount(productList.value.length))

      const productListNotEmpty = computed(() => productList.value.length > 0)
      store.dispatch('cart/loadCart')

    return {
      productList,
      cartTotalPrice,
      productListLoad,
      cartTotalPricePretty,
      prettyProductAmount,
      productListNotEmpty,

    }
  }
})

//   computed: {

//     totalAmount() {
//       let str = '';
//       switch (this.productList.length) {
//         case 0:
//           str = 'Корзина пуста';
//           break;
//         case 1:
//           str = '1 товар';
//           break;
//         case 2:
//         case 3:
//         case 4:
//           str = `${this.productList.length} товара`;
//           break;
//         default:
//           str = `${this.productList.length} товаров`;
//       }
//       return str;
//     },
//     productListNotEmpty() {
//       return this.productList.length > 0;
//     },
//   },
// };
</script>
