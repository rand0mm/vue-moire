<template>
    <li class="cart__order">
      <h3>{{  item.product.title}}</h3>
      <b>{{item.product.price}} ₽</b>
      <span>Артикул: {{item.product.id}}</span>
    </li>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['item'],
  computed: {
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
