<template>
    <li class="cart__item product">
      <div class="product__pic">
        <img :src="item.product.img" width="120" height="120"
          :alt="item.product.title">
      </div>
      <h3 class="product__title">
        {{item.product.title}}
      </h3>
      <span class="product__code">
        {{item.product.id}}
      </span>

      <div class="product__counter form__counter">
        <button type="button" aria-label="Убрать один товар"
         @click.prevent="updatedAmont(amount - 1)">
          <svg width="10" height="10" fill="currentColor">
            <use xlink:href="#icon-minus"></use>
          </svg>
        </button>

        <input type="text" v-model.number="amount">

        <button type="button" aria-label="Добавить один товар"
        @click.prevent="updatedAmont(amount + 1)">
          <svg width="10" height="10" fill="currentColor">
            <use xlink:href="#icon-plus"></use>
          </svg>
        </button>
      </div>

      <b class="product__price">
        {{ totalPricePretty }}
      </b>

      <button class="product__del button-del" type="button"
      aria-label="Удалить товар из корзины" @click.prevent="removeProduct(item.product.id)">
        <svg width="20" height="20" fill="currentColor">
          <use xlink:href="#icon-close"></use>
        </svg>
      </button>
    </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';

export default {
  props: ['item'],
  computed: {
    totalPricePretty() {
      return numberFormat( this.item.product.price * this.item.amount)
    },
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.updateProductAmount({ productId: this.item.product.id, amount: value });
      },
    },
  },
  methods: {
    ...mapActions({ removeProduct: 'removeProduct', updateProductAmount: 'updateProductAmount' }),
    updatedAmont(newAmount) {
      if (newAmount >= 1) {
        this.amount = newAmount;
      } else {
        this.removeProduct(this.item.product.id);
      }
    },
  },
};
</script>
