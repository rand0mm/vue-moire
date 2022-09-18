<template>
    <li class="cart__item product">
      <div class="product__pic">
        <img
          :src="item.product.img"
          :alt="item.product.title"
          width="120" height="120"
        >
      </div>

      <h3 class="product__title">
        {{item.product.title}}
      </h3>

      <span class="product__info">
        <span
          v-for="(skuItem, index) in item.product.sku"
          :key="index">
          {{skuItem.title}}:
          <span>
            <i
              v-if="skuItem.title === 'Цвет'"
              style="background-color: #FF9B78">
            </i>
            {{skuItem.value}} &nbsp;
          </span>
        </span>
      </span>

      <span class="product__code">
        Артикул:&nbsp;{{item.product.id}}
      </span>

      <div class="product__counter form__counter">
        <button
          type="button"
          aria-label="Убрать один товар"
          @click.prevent="doUpdatedAmont(amount - 1)">
          <svg width="10" height="10" fill="currentColor">
            <use xlink:href="#icon-minus"></use>
          </svg>
        </button>

        <input
          type="text"
          v-model.number="amount"
        >
        <button
          type="button"
          aria-label="Добавить один товар"
          @click.prevent="doUpdatedAmont(amount + 1)">
          <svg width="10" height="10" fill="currentColor">
            <use xlink:href="#icon-plus"></use>
          </svg>
        </button>
      </div>

      <b class="product__price">
        {{ totalPricePretty }}
      </b>

      <button
        class="product__del button-del"
        type="button"
        aria-label="Удалить товар из корзины"
        @click.prevent="doUpdatedAmont(0)">
        <svg width="20" height="20" fill="currentColor">
          <use xlink:href="#icon-close"></use>
        </svg>
      </button>
    </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { defineComponent, computed} from 'vue';
import { useStore } from 'vuex'
export default defineComponent({
  props: [ 'item' ],
  setup(props) {
    const store = useStore();

    const totalPricePretty = computed(() => numberFormat( props.item.product.price * props.item.amount));
    const amount = computed({
      get() {
        return props.item.amount;
      },
      set(value) {
        store.dispatch('cart/updateProductAmount', { productId: props.item.product.id, amount: value })
      },
    })
    const doUpdatedAmont = (newAmount) => {
      if (newAmount >= 1) {
        amount.value = newAmount;
      } else {
        store.dispatch('cart/removeProduct', props.item.product.id)
      }
    };
    return {
      totalPricePretty,
      amount,

      doUpdatedAmont
    }
  }
})
</script>
