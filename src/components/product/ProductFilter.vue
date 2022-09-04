<template>
  <h2 class="filter__title">Фильтры</h2>

  <form v-bind="$attrs" class="filter__form form" action="#" method="get" @submit.prevent="doSubmit">
    <fieldset class="form__block">
      <legend class="form__legend">Цена</legend>
      <label class="form__label form__label--price">
        <input class="form__input" type="text"
         name="min-price" v-model.number="curPriceFrom">
        <span class="form__value">От</span>
      </label>
      <label class="form__label form__label--price">
        <input class="form__input" type="text"
         name="max-price" v-model.number="curPriceTo">
        <span class="form__value">До</span>
      </label>
    </fieldset>

    <fieldset class="form__block">
      <legend class="form__legend">Категория</legend>
      <label class="form__label form__label--select">
        <select class="form__select" name="category" v-model.number="curCategory">
          <option value="0">Все категории</option>
          <option :value="category.id"
          v-for="category in categories"
          :key="category.id">
           {{ category.title }}
          </option>
        </select>
      </label>
    </fieldset>

    <fieldset class="form__block">
      <legend class="form__legend">Материал</legend>
      <ul class="check-list">
        <li
        class="check-list__item"
        v-for="material in materials"
        :key="material.id">
          <label class="check-list__label">
            <input class="check-list__check sr-only"
            type="checkbox" :value="material.id"
            v-model.number="curMaterial">
            <span class="check-list__desc">
              {{ material.title}}
            <span>({{material.productsCount}})</span>
            </span>
          </label>
        </li>
      </ul>
    </fieldset>

    <fieldset class="form__block">
      <legend class="form__legend">Коллекция</legend>
      <ul class="check-list">
        <li
        class="check-list__item"
        v-for="season in seasons"
        :key="season.id">
          <label class="check-list__label">
            <input class="check-list__check sr-only"
             type="checkbox" :value="season.id"
            v-model.number="curSeason">
            <span class="check-list__desc">
              {{season.title}}
              <span>({{season.productsCount}})</span>
            </span>
          </label>
        </li>
      </ul>
    </fieldset>

    <button class="filter__submit button button--primery"
     type="submit">
      Применить
    </button>
    <button class="filter__reset button button--second"
    type="button"  @click.prevent="doReset">
      Сбросить
    </button>
  </form>
</template>

<script>
import { useStore } from 'vuex';
import { defineComponent, ref, computed, watch, toRefs} from 'vue';

export default defineComponent({
  props: ['priceFrom', 'priceTo', 'categoryId', 'material', 'season'],
  setup(props, { emit }) {
    const store = useStore()
    const { priceFrom, priceTo, categoryId, material, season } = toRefs(props)

    const curPriceFrom = ref(0)
    const curPriceTo = ref(0)
    const curCategory = ref(0)
    const curMaterial = ref(0)
    const curSeason = ref(0)

    const categories = computed(() => store.getters['products/productCategories'])
    const materials = computed(() => store.getters['products/materials'])
    const seasons = computed(() => store.getters['products/seasons'])

    const doSubmit = () => {
      emit('update:priceFrom',curPriceFrom.value);
      emit('update:priceTo',curPriceTo.value);
      emit('update:categoryId',curCategory.value);
      emit('update:material',curMaterial.value);
      emit('update:season',curSeason.value);

    }
    const doFilterReset = () => {
      emit('update:priceFrom', 0);
      emit('update:priceTo', 0);
      emit('update:categoryId', 0);
      emit('update:material', curMaterial.value);
      emit('update:season',curSeason.value);

    }
    watch(priceFrom, (val1, val2) => {
      curPriceFrom.value = val2
    })
    watch(priceTo, (val1, val2) => {
      curPriceTo.value = val2
    })
    watch(categoryId, (val1, val2) => {
      curCategory.value = val2
    })
    watch(material, (val1, val2) => {
      curMaterial.value = val2
    })
    watch(season, (val1, val2) => {
      curSeason.value = val2
    })
    return {
      curPriceFrom,
      curPriceTo,
      curCategory,
      curMaterial,
      curSeason,

      categories,
      materials,
      seasons,

      doSubmit,
      doFilterReset,

    }

  }

});
</script>
