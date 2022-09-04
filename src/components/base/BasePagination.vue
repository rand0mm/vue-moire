<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow"
        aria-label="Предыдущая страница"
        :class="{' pagination__link--disabled': page == 1}"
        @click.prevent="doPaginate(page - 1)">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item" v-for="pageNumber in pageCount" :key="pageNumber">
      <a href="#" class="pagination__link"
      :class="{ 'pagination__link--current': pageNumber == page}"
      @click.prevent="doPaginate(pageNumber)">
        {{ pageNumber }}
      </a>
    </li>
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow"
        href="#" aria-label="Следующая страница"
        :class="{' pagination__link--disabled': page == pageCount}"
        @click.prevent="doPaginate(page + 1)">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
import { defineComponent, computed} from 'vue';

export default defineComponent({
  props: ['modelValue', 'count', 'perPage'],
  setup(props, { emit }) {
    const page = computed(() => {
      return props.modelValue
    })
    const pageCount = computed(() => {
      return Math.ceil(props.count / props.perPage);
    })

    const doPaginate = (newPage) => {
      if (newPage >= 1 && newPage <= pageCount.value) {
        emit('update:modelValue', newPage);
      }
    }
    return {
      page,
      pageCount,

      doPaginate,
    }
  }
})
</script>
