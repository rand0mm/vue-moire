<template>
  <main class="content container" v-if="productStatus.isLoading">Згрузка товаров</main>
  <main class="content container" v-else-if="productStatus.isFailed">Не удалось загрузить товар</main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main', params: {categoryId: category.id}}">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570"
            :src="curPic.img"
            :alt="product.title">
        </div>
        <ul class="pics__list">
          <li class="pics__item" v-for="pic in pics"
            :key="pic.id"
            @click.prevent="doChangePic(pic.id)" >
            <a href="" class="pics__link"
              :class="{ 'pics__link--current': curPic.id == pic.id}">
              <img width="98" height="98" :src="pic.img" :alt="product.title">
            </a>
          </li>
        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул:{{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST">
            <div class="item__row item__row--center">
              <ProductAmount v-model:productAmount="curAmount"/>
              <b class="item__price">
                {{ product.pricePretty }} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ProductColorsVue :colors="product.colorList" v-model="curColor.id"/>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" name="sizes" v-model.number="curSize">
                    <option v-for="size in product.sizes"
                     :value="size.id"
                     :key="size.id">

                     {{ size.title }}

                    </option>
                  </select>
                </label>
              </fieldset>
            </div>
            <ProductAddToCartVue
            :product="curProduct"
             class="item__button"/>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link"
              :class="{ 'tabs__link--current': isShowMaterial}"
              @click.prevent="isShowMaterial = true">
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link"
              :class="{ 'tabs__link--current': !isShowMaterial}" href="#"
              @click.prevent="isShowMaterial = false">
              Доставка и возврат
            </a>
          </li>
        </ul>

        <div class="item__content" v-if="isShowMaterial">
          <h3>Состав:</h3>

          <p>
            <span v-for="material in product.materials"
             :key="material.id">
            {{  material.title }}<br/>
            </span>
          </p>

          <h3>Уход:</h3>

          <p>
            Машинная стирка при макс. 30ºC короткий отжим<br>
            Гладить при макс. 110ºC<br>
            Не использовать машинную сушку<br>
            Отбеливать запрещено<br>
            Не подвергать химчистке<br>
          </p>

        </div>
        <div class="item__content" v-else>
          <h3>Доставка:</h3>

          <p>
            <span v-for="deliver in delivers" :key="deliver.id">
             {{deliver.str}}<br>
            </span>
          </p>

          <h3>Возврат:</h3>

          <p>
            Любой возврат должен быть осуществлен в течение Возвраты в магазине БЕСПЛАТНО.<br>
            Вы можете вернуть товары в любой магазин. Магазин должен быть расположен в стране, в которой Вы осуществили покупку.
            БЕСПЛАТНЫЙ возврат в Пункт выдачи заказов.<br>
            Для того чтобы вернуть товар в одном из наших Пунктов выдачи заказов, позвоните по телефону 8 800 600 90 09<br>
          </p>

        </div>
      </div>
    </section>
  </main>
</template>
<script>
import ProductAmount from '@/components/product/ProductAmount.vue';
import ProductAddToCartVue from '@/components/product/ProductAddToCart.vue';
import ProductColorsVue from '@/components/product/ProductColors.vue';
// import { useStore } from 'vuex';
import { defineComponent, ref, computed, watch} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex'


import useProduct from '@/hooks/useProduct'

export default defineComponent({
  components: { ProductAmount, ProductAddToCartVue, ProductColorsVue },
  setup() {
    const store = useStore();
    const route = useRoute();

    const { product, category, fetchProduct, status: productStatus} = useProduct();

    const curAmount = ref(1);
    const curColor = ref({
      id: 0,
      colorId: 0,
    })
    const curSize = ref(1)
    const curPic = ref({
      id: 0,
      img: '',
    })

    const isShowMaterial = ref(false)
    const pics = computed(() => {
     let picsArr = product.value.colorList.find((i) => i.id == curColor.value.id).gallery
      if(picsArr) {
        return picsArr.map((p, index) => {
          return {
            id: index,
            img: p.file.url
          }
        })
      } else {
        return []
      }
    })

    const curProduct = computed(() => {
      return {
        productId: product.value.id,
        colorId: curColor.value.colorId,
        sizeId: curSize.value,
        amount: curAmount.value,
      }
    })
    const delivers = computed(() => {
      let arr = store.getters['cart/deliversData'];
      if(arr) {
        arr = arr.map((i) => {
          return {
            ...i,
            str: i.title === 'Самовывоз' ?
            `${i.id}. Самовывоз из магазина. Список и адреса магазинов Вы можете посмотреть здесь`
              :`${i.id}. ${i.title} - ${i.price} ₽`,
          }
      })
      }
      return arr
    })

    const doChangePic = (newId) => {
      const newItem = pics.value.find(i => i.id == newId)
      curPic.value = {...newItem}
    }

    watch(product, () => {
      curPic.value.img = product.value.img
      curColor.value = product.value.color
      curSize.value = product.value.size
    })

    watch(curColor, () => {
      doChangePic(pics.value[0].id)
    }, { deep: true })

    fetchProduct(route.params.id);

    store.dispatch('cart/getDelivers')

    return {
      productStatus,
      product,
      category,
      pics,
      curPic,
      curColor,
      curAmount,
      curSize,
      curProduct,
      isShowMaterial,
      delivers,

      doChangePic,
    }
  }

})

</script>
