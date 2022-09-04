<template>
    <main class="content container" v-if="productListLoad"> Загрузка товаров </main>
    <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
            Каталог
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{totalAmount}}
      </span>
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

          <router-link v-slot="{navigate}" custom  :to="{ name: 'order'}">
            <button v-if="productListNotEmpty" @click="navigate"
          class="cart__button button button--primery" type="button">
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
import { mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  components: { CartItemVue },
  methods: {
    removeFromCart(productId) {
      this.$store.commit('removeProductToCart', { productId });
    },
  },
  computed: {
    cartTotalPricePretty() {
      return numberFormat(this.cartTotalPrice)
    },
    ...mapGetters({
      productList: 'cartDetailProducts',
      cartTotalPrice: 'cartTotalPrice',
      productListLoad: 'cartProductListLoad',
    }),
    totalAmount() {
      let str = '';
      switch (this.productList.length) {
        case 0:
          str = 'Корзина пуста';
          break;
        case 1:
          str = '1 товар';
          break;
        case 2:
        case 3:
        case 4:
          str = `${this.productList.length} товара`;
          break;
        default:
          str = `${this.productList.length} товаров`;
      }
      return str;
    },
    productListNotEmpty() {
      return this.productList.length > 0;
    },
  },
};
</script>
