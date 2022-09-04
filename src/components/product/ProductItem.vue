<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name:'product', params: {id: productNormal.id}}">
      <img :src="curImg" :alt="productNormal.title">
    </router-link>

    <h3 class="catalog__title">
      <a href="#" @click.prevent="doOpenQuickView(productNormal.id)">
        {{productNormal.title}}
      </a>
    </h3>

    <span class="catalog__price">
        {{ productNormal.pricePretty }} ₽
    </span>

    <ul class="colors colors--black">
      <ProductColorsVue :colors="productNormal.colorList" v-model="curColor"/>
    </ul>
  </li>
  <BaseModalVue v-model:open="isQuickViewOpen">
    <ProductQuickViewVue :product-id="currentProductId"/>
  </BaseModalVue>
</template>
<script>
import numberFormat from '@/helpers/numberFormat';
import BaseModalVue from '@/components/base/BaseModal.vue';
import ProductColorsVue from './ProductColors.vue';
import { defineAsyncComponent, h, defineComponent, ref, computed, watch} from 'vue';

export default defineComponent({
  inheritAttrs: false,
  components: { BaseModalVue, ProductColorsVue, ProductQuickViewVue: defineAsyncComponent({
    loader: () => import('@/components/product/ProductQuickView.vue'),
    delay: 0,
    loadingComponent: () => h('div', 'Загрузка...')

  })},
  props: ['product'],

  setup(props) {
    const currentProductId = ref(null)

    const curImg = ref(props.product.img)

    const curColor = ref(props.product.color)

    watch(curColor, () => {
      let val = props.product.colorList.find((i) => i.id === curColor.value).gallery[0].file.url
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



    const productNormal = computed(() => {
      return {...props.product, pricePretty: numberFormat( props.product.price )}
    })

    const doOpenQuickView = (productId) => {
      currentProductId.value = productId;
    }

    return {
      currentProductId,
      isQuickViewOpen,
      productNormal,
      curImg,
      curColor,

      doOpenQuickView
    }
  },
});
</script>
