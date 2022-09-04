<template>
  <ul class="catalog__list">
    <ProductItemVue
      v-for="(product) in productList" :key="product.id" :product="product"
      :data-prodid="product.id"
      :productList="productList"
    />
  </ul>
</template>
<script>
import ProductItemVue from '@/components/product/ProductItem.vue';

export default {
  components: { ProductItemVue },
  props: ['productList'],

};
</script>
