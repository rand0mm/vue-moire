<template>
  <div class="form__counter">
    <button type="button" aria-label="Убрать один товар"
    @click.prevent="chageAmount(curProductAmount - 1)">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input type="text" v-model.number="curProductAmount">

    <button type="button" aria-label="Добавить один товар"
    @click.prevent="chageAmount(curProductAmount + 1)">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: ['productAmount'],
  data() {
    return {
      curProductAmount: this.productAmount,
    };
  },
  methods: {
    chageAmount(newAmount) {
      if (newAmount >= 1) {
        this.curProductAmount = newAmount;
      }
    },
  },
  watch: {
    productAmount(value) {
      this.curProductAmount = value;
    },
    curProductAmount(value) {
      if (value >= 1) {
        this.$emit('update:productAmount', value);
      } else {
        this.curProductAmount = null;
      }
    },
  },
};
</script>
