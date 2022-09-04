<template>
 <main class="content container" v-if="orderInfoObj.error">{{orderInfoObj.error.message}}</main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{orderInfoObj.id}}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина.
            На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{orderInfoObj.name}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ orderInfoObj.address}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{orderInfoObj.phone}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{orderInfoObj.email}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                картой при получении
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
             <OrderCartItemVue
             v-for="item in orderCartItemList" :key="item.id" :item="item"/>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>Итого: {{totalAmount}} на сумму <b>{{orderInfoTotalPrice+500}} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>

</template>

<script>
import { mapGetters } from 'vuex';
import OrderCartItemVue from '@/components/cart/OrderCartItem.vue';

export default {
  components: { OrderCartItemVue },
  created() {
    if (this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id) {
      return;
    }
    this.$store.dispatch('loadOrderInfo', this.$route.params.id);
  },
  computed: {
    ...mapGetters({
      orderInfo: 'orderInfo',
    }),
    orderInfoTotalPrice() {
      return this.orderCartItemList
        .reduce((acc, item) => (item.product.price * item.quantity) + acc, 0);
    },
    totalAmount() {
      let str = '';
      switch (this.orderCartItemList.length) {
        case 0:
          str = 'Корзина пуста';
          break;
        case 1:
          str = '1 товар';
          break;
        case 2:
        case 3:
        case 4:
          str = `${this.orderCartItemList.length} товара`;
          break;
        default:
          str = `${this.orderCartItemList.length} товаров`;
      }
      return str;
    },
    orderInfoObj() {
      if (this.orderInfo) {
        return this.orderInfo;
      }
      return {};
    },
    orderCartItemList() {
      return this.orderInfoObj.basket ? this.orderInfoObj.basket.items : [];
    },

  },
};
</script>
