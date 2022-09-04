<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          {{ prettyProductAmount }}
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <aside class="filter">
        <ProductFilter
          v-model:price-from="priceFrom"
          v-model:price-to="priceTo"
          v-model:category-id="categoryId"
          v-model:material="material"
          v-model:season="season"
          v-model:color="color"/>
      </aside>

      <section class="catalog">
        <div v-if="productsLoading">
          Загрузка товаров...
        </div>

        <div v-if="productsLoadingFailed">
          Произошла ошибка при загрузке товаров
          <button @click.prevent="doLoadProductList">
            Попробовать еще раз
          </button>
        </div>

        <ProductListVue :productList="productList"/>

        <BasePagination
          v-model="page"
          :count="countProductList"
          :per-page="productPerPage"
         />
      </section>
    </div>
  </main>
</template>

<script>
import ProductListVue from '@/components/product/ProductList.vue';
import BasePagination from '@/components/base/BasePagination.vue';
import ProductFilter from '@/components/product/ProductFilter.vue';
import productAmount from '@/helpers/productAmount';
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from 'vuex'

export default defineComponent({
  components: { ProductListVue, BasePagination, ProductFilter },
  setup() {
    const store = useStore()

    const priceFrom = ref(0)
    const priceTo = ref(0)
    const categoryId = ref(0)
    const material = ref([])
    const season = ref([])
    const color = ref([])
    const page = ref(1)
    const productPerPage = ref(12)

    const productsLoading = ref(false)
    const productsLoadingFailed = ref(false)
    const loadProductsTimer = ref(null)

    const productList = computed(() => store.getters['products/products'])

    const countProductList = computed(() => store.getters['products/countProduct'])

    const prettyProductAmount = computed(() => productAmount(countProductList.value))

    const doLoadProductList = async () =>{
      productsLoading.value = true;
      productsLoadingFailed.value = false;
      clearTimeout(loadProductsTimer.value);

      loadProductsTimer.value = setTimeout(async () => {
       try {
        await store.dispatch('products/getProducts',{
            params: {
              page: page.value,
              limit: productPerPage.value,
              categoryId: categoryId.value,
              minPrice: priceFrom.value,
              maxPrice: priceTo.value,
              materialIds: material.value,
              seasonIds: season.value,
              colorIds: color.value
            },
        })
       } catch (error) {
        productsLoadingFailed.value = true;
       }
       finally {
        productsLoading.value = false;
       }
      }, 0);
    }

    watch([page,categoryId,priceFrom,priceTo,material,season, color], () => {
      doLoadProductList()
    })

    doLoadProductList();

    return {
      priceFrom,
      priceTo,
      categoryId,
      material,
      color,
      season,
      page,
      productPerPage,

      productsLoading,
      productsLoadingFailed,
      loadProductsTimer,
      prettyProductAmount,

      productList,
      countProductList,

      doLoadProductList,

    }
  }
});
</script>
