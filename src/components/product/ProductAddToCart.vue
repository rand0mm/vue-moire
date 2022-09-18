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
    <div v-if="productAddError">{{productAddError.message}}</div>
    <div v-else>
      Товар добавлен в корзину
    </div>
  </BaseModalVue>
</template>

<script>
import BaseModalVue from '@/components/base/BaseModal.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
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
    const productAddError = ref(null);

    const doAddToCart = async () => {
      isProductAddLoad.value = true;
      isShowAddedMessage.value = false
      if(!product.value.sizeId) {
        try {
          // берем первый размер в списке
          const res = await axios.get(`${API_BASE_URL}/api/products/${product.value.productId}`)
          product.value.sizeId = res.data.sizes[0].id
        } catch (error) {
          isProductAddLoad.value = false;
          isShowAddedMessage.value = true;
          productAddError.value = error.response.data.error
          return
        }
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
      productAddError,

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
