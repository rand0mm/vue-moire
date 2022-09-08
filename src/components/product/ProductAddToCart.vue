<template>
  <button v-bind="$attrs" class="button button--primery"  type="submit"
   :disabled="isProductAddLoad"
   @click.prevent="doAddToCart">
   <div v-if="isProductAddLoad">Загрузка...</div>
    <span v-else>
      В корзину
    </span>
  </button>
  <BaseModalVue v-model:open="isShowAddedMessage">
    Товар добавлен в корзину
  </BaseModalVue>
</template>

<script>
import BaseModalVue from '@/components/base/BaseModal.vue';
import shop from '@/api/shop'

import { defineComponent, ref, computed} from 'vue';
import { useStore } from 'vuex';


export default defineComponent({
  props: ['product'],
  components: {BaseModalVue},
  setup(props) {
    const store = useStore();
    const product = computed(() => props.product)
    const isShowAddedMessage = ref(false)

    const isProductAddLoad = ref(false);

    const doAddToCart = async () => {
      isProductAddLoad.value = true;
      isShowAddedMessage.value = false
      if(!product.value.sizeId) {
        const res = await shop.getProduct(product.value.productId);
        product.value.sizeId = res.data.sizes[0].id
      }
      let params = {
        productId: product.value.productId,
        colorId: product.value.colorId,
        sizeId: product.value.sizeId,
        amount: product.value.amount || 1,
      }

      if(await store.dispatch('cart/addProductToCart', params)) {
        isShowAddedMessage.value = true;
      }

      isProductAddLoad.value = false;
    }

    return {
      isProductAddLoad,
      isShowAddedMessage,

      doAddToCart,
    }
  }
})
</script>

<style scoped>
  .catalog__button {
    margin-top: auto;
    width: 100%;
  }
</style>
