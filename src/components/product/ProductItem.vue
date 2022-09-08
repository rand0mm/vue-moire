<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name:'product', params: {id: product.id}}">
      <img :src="curImg" :alt="product.title">
    </router-link>

    <h3 class="catalog__title">
      <a href="#" @click.prevent="doOpenQuickView(product.id)">
        {{product.title}}
      </a>
    </h3>

    <span class="catalog__price">
        {{ product.pricePretty }} ₽
    </span>

    <ProductColorsVue
      :colors="product.colorList"
      v-model="curColor.id" class="catalog__colors"/>
    <ProductAddToCartVue :product="curProduct" class="catalog__button"/>
  </li>
  <BaseModalVue v-model:open="isQuickViewOpen">
    <ProductQuickViewVue :product-id="currentProductId"/>
  </BaseModalVue>
</template>
<script>
import BaseModalVue from '@/components/base/BaseModal.vue';
import ProductColorsVue from './ProductColors.vue';
import ProductAddToCartVue from '@/components/product/ProductAddToCart.vue';

import { defineAsyncComponent, h, defineComponent, ref, computed, watch} from 'vue';

export default defineComponent({
  inheritAttrs: false,
  components: { BaseModalVue, ProductColorsVue, ProductAddToCartVue, ProductQuickViewVue: defineAsyncComponent({
    loader: () => import('@/components/product/ProductQuickView.vue'),
    delay: 0,
    loadingComponent: () => h('div', 'Загрузка...')

  })},
  props: ['product'],

  setup(props) {
    const currentProductId = ref(null)

    const curImg = ref(props.product.img)

    const curColor = ref(props.product.color)

    const curProduct = computed(() => {
      return {
        productId: props.product.id,
        colorId: curColor.value.colorId,
        sizeId: null,
        amount: 1,
      }
    })

    watch(curColor.value, () => {
      let val = props.product.colorList.find((i) => i.id === curColor.value.id).gallery[0].file.url
      curImg.value = `${val}`
    })

    const isQuickViewOpen = computed({
      get() {
        return !!currentProductId.value;
      },
      set(isOpen) {
        if(!isOpen) {
          currentProductId.value = null;
        }
      }
    })

    const doOpenQuickView = (productId) => {
      currentProductId.value = productId;
    }

    return {
      currentProductId,
      isQuickViewOpen,
      curImg,
      curColor,
      curProduct,

      doOpenQuickView
    }
  },
});
</script>


<style scoped>
  .catalog__item {
    display: flex;
    flex-direction: column;
  }
</style>
