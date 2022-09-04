<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <main class="content container">
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
        Корзина
      </h1>
      <span class="content__info">
        {{totalAmount}}
      </span>
    </div>

    <section class="cart">
      <div v-if="formDataLoad">Отправка заказа...</div>
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order" v-else>
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormTextVue title="ФИО" placeholder="Введите ваше полное имя"
            v-model="formData.name" :error="formError.name"/>

            <BaseFormTextVue title="Адрес доставки" placeholder="Введите ваш адреc"
            v-model="formData.address" :error="formError.address"/>

            <BaseFormTextVue title="Телефон" type="tel" placeholder="Введите ваш телефон"
            v-model="formData.phone" :error="formError.phone"/>

            <BaseFormTextVue title="Почта" type="email" placeholder="Введи ваш Email"
            v-model="formData.email" :error="formError.email"/>

            <BaseFormTextarea title="Комментарий к заказу" placeholder="Ваши пожелания"
              v-model="formData.comment" :error="formError.comment"/>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only"
                   type="radio" name="delivery" value="0" checked="">
                  <span class="options__value">
                    Самовывоз <b>бесплатно</b>
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" value="500">
                  <span class="options__value">
                    Курьером <b>500 ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" value="card">
                  <span class="options__value">
                    Картой при получении
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" value="cash">
                  <span class="options__value">
                    Наличными при получении
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <OrderCartItem v-for="item in productList" :key="item.id" :item="item"/>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>Итого: {{totalAmount}} на сумму <b>{{cartTotalPrice+500}} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{formErrorMessage}}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>
<script>
import BaseFormTextVue from '@/components/base/BaseFormText.vue';
import BaseFormTextarea from '@/components/base/BaseFormTextarea.vue';
import OrderCartItem from '@/components/cart/OrderCartItem.vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import { API_BASE_URL } from '@/config';

export default {
  components: { BaseFormTextVue, BaseFormTextarea, OrderCartItem },
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      formDataLoad: false,

    };
  },
  computed: {
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
  },
  methods: {
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.formDataLoad = true;
      axios
        .post(`${API_BASE_URL}/api/orders`, {
          ...this.formData,
        }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey,
          },
        })
        .then((res) => {
          this.$store.commit('resetCart');
          this.$store.commit('updateOrderInfo', res.data);
          this.$router.push({ name: 'orderInfo', params: { id: res.data.id } });
        })
        .catch((error) => {
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message || '';
        })
        .then(() => {
          this.formDataLoad = false;
        });
    },
  },
};
</script>
