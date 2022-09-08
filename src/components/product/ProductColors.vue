<template>
  <ul class="colors colors--black">
    <li class="colors__item" v-for="color in colorList" :key="color.id">
      <label class="colors__label">
        <input class="colors__radio sr-only" type="radio" :value="color.id"
            v-model.number="curColor">
        <span class="colors__value" :style="{ 'background-color': color.color.code }">
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
import { defineComponent, computed} from 'vue';

export default defineComponent({
  props: ['colors','modelValue'],

  setup(props,{emit}) {
    const curColor = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })
    const colorList = computed(() => props.colors)

    return {
      colorList,
      curColor,
    }
  }
});
</script>

<style scoped>
  .catalog__colors {
    margin-bottom: 20px;
  }
</style>
